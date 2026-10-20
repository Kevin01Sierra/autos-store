# Propuesta de escalabilidad

> Diagrama interactivo: [escalabilidad.html](https://rueda-autos.vercel.app/diagramas/escalabilidad.html) · fuente: [`diagramas/fuentes/escalabilidad.architecture.json`](diagramas/fuentes/escalabilidad.architecture.json)

![Propuesta de escalabilidad](diagramas/img/escalabilidad.png)

Rueda hoy corre en planes gratuitos: una función serverless de Vercel (Nest arranca una vez
por instancia y se reutiliza), una base Postgres de Supabase y un cron semanal en GitHub
Actions. Esto alcanza para una prueba técnica y un tráfico moderado. Esta propuesta explica
qué se rompe primero cuando el tráfico crece y cómo resolverlo **sin reescribir el
sistema**, aprovechando que los módulos ya se comunican por puertos y eventos.

## 1. Dónde está el límite hoy

| # | Cuello de botella | Dónde está en el código | Qué pasa con más tráfico |
|---|---|---|---|
| 1 | Cada `GET` del catálogo, marcas, modelos y mercado llega a Postgres | Controladores sin `Cache-Control` | La base atiende lecturas repetidas que la CDN podría servir |
| 2 | `unitsByKey()` agrega **toda** la tabla `market_stats` en cada recomendación | `drizzle-market-stats.repository.ts`, `recommendations.service.ts` | Consulta pesada por petición; crece con el tamaño del dataset del RUNT |
| 3 | La caché de mercado vive en la memoria de cada instancia | `resilient-market.source.ts` (`ttlMs` de 1 h) | Con N instancias hay N cachés frías y N llamadas a datos.gov.co |
| 4 | El listener refresca la vista `sales_stats` en **cada** pedido | `sales-stats.listener.ts` (`REFRESH MATERIALIZED VIEW CONCURRENTLY`) | Con muchas compras por minuto los refrescos se encolan y compiten con las escrituras |
| 5 | El evento `order.placed` se procesa en memoria (EventEmitter2) | `PurchaseFacade` → `SalesStatsListener` | En serverless la instancia puede congelarse al responder y el evento se pierde |
| 6 | La sincronización de mercado pide una sola página | `socrata-query.ts` (`$limit: 5000`) y `maxDuration: 30` | Más de 5.000 combinaciones o más de 30 s dejan datos incompletos |
| 7 | La búsqueda usa `ILIKE '%texto%'` y paginación con `OFFSET` | `vehicle-conditions.builder.ts`, `drizzle-vehicle.repository.ts` | Escaneo completo de tablas cuando el inventario pase de miles de filas |
| 8 | `POST /api/recommendations` es público y sin límite | `recommendations.controller.ts` | Un bot puede disparar la consulta más costosa del sistema sin freno |
| 9 | `POST /api/orders` no es idempotente | `orders.controller.ts` | Un reintento del navegador o de la red puede crear dos pedidos |

## 2. Fase 1: leer menos de la base de datos

Objetivo: que la mayoría de lecturas no lleguen a Postgres. Es la fase más barata y la que
más impacto tiene.

- **CDN de Vercel.** Agregar `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
  a los `GET` públicos (catálogo, marcas, modelos, colores, mercado). Un interceptor de Nest
  basta, aplicado solo a rutas sin `@Auth`. La CDN responde mientras revalida en segundo plano.
- **Caché compartida (Upstash Redis).** Implementar un nuevo adaptador del mismo puerto
  `MarketSource`/`MarketStatsRepository` que guarde en Redis el mapa de unidades por
  marca y modelo (se invalida cuando corre la sincronización semanal) y las respuestas de
  recomendaciones por hash de preferencias (TTL corto). Al ser un Decorator más, el
  servicio no cambia.
- **Protección del endpoint público.** Rate limit por IP en `POST /api/recommendations`
  (por ejemplo `@upstash/ratelimit`, 30 peticiones por minuto).
- **Índices de búsqueda.** Extensión `pg_trgm` con índices GIN en `brands.name` y
  `models.name` para que `ILIKE '%texto%'` use índice.

Resultado esperado: las lecturas repetidas salen de la CDN o de Redis, y la consulta más
costosa (`unitsByKey`) pasa de ejecutarse en cada recomendación a una vez por semana.

## 3. Fase 2: sacar el trabajo pesado de la petición

Objetivo: que una compra responda rápido y que ningún efecto secundario se pierda.

- **Patrón Outbox.** `DrizzleOrderRepository.place` ya abre una transacción (Unit of Work):
  dentro de ella se inserta también una fila en `outbox_events`. Un worker (QStash o un cron
  de Vercel) lee la tabla y publica el evento. Si la función se congela, el evento sigue en
  la base y se procesa después. El listener actual se convierte en el consumidor.
- **Refresco en lote de `sales_stats`.** En lugar de refrescar la vista en cada pedido, el
  worker la refresca como máximo cada 5 minutos si hubo eventos. Las recomendaciones toleran
  ese retraso.
- **Sincronización por páginas.** Recorrer el dataset de Socrata con `$offset` en bloques de
  5.000 filas, guardando cada bloque con el upsert idempotente que ya existe. Si una
  ejecución no termina en 30 s, el cron la reanuda desde la última página.
- **Paginación por cursor** en el catálogo (`created_at, id`) en lugar de `OFFSET`.

## 4. Fase 3: crecer horizontalmente

Objetivo: separar lecturas de escrituras y poder escalar cada parte por separado.

- **Réplicas de lectura de Supabase.** El token `DATABASE` se divide en `DATABASE_WRITE` y
  `DATABASE_READ`; catálogo, mercado y recomendaciones leen de la réplica y pedidos escribe
  en el primario.
- **Extraer servicios.** Recomendaciones y Datos de mercado ya no dependen de Pedidos (solo
  escuchan eventos). Pueden pasar a su propio despliegue consumiendo la cola del Outbox, sin
  tocar el resto de la API.
- **Idempotencia.** Encabezado `Idempotency-Key` en `POST /api/orders` guardado con
  restricción única: un reintento devuelve el pedido ya creado.
- **Observabilidad.** OpenTelemetry para trazas entre API, base y worker, y Sentry para
  errores. Sin métricas no se sabe qué fase hace falta.

## 5. Orden recomendado y costo

| Fase | Esfuerzo | Costo extra aproximado | Cuándo hacerla |
|---|---|---|---|
| 1 | 1 a 2 días | Plan gratuito de Upstash Redis | Antes de cualquier campaña o pico de tráfico |
| 2 | 3 a 5 días | Plan gratuito de QStash | Cuando haya más de unas pocas compras por minuto |
| 3 | 1 a 2 semanas | Supabase Pro (réplicas) | Cuando la base primaria supere el 60 % de CPU de forma sostenida |

Ninguna fase rompe las reglas del repositorio: cada cambio es un adaptador nuevo detrás de
un puerto existente, enlazado en su `*.module.ts`, y el dominio sigue sin importar Nest ni
Drizzle.
