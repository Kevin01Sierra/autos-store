# Arquitectura

## Vista general

```mermaid
flowchart LR
  user([Cliente / Admin]) --> web[React SPA<br/>Vercel]
  web -- JWT --> api[API NestJS<br/>Vercel Function]
  web -- login --> auth[Supabase Auth]
  api --> db[(Supabase Postgres)]
  api -- verifica JWT con JWKS --> auth
  cron[GitHub Actions<br/>cron semanal] -- POST /market/sync --> api
  api -- SoQL --> runt[(datos.gov.co<br/>parque automotor)]
```

## Capas de cada módulo (arquitectura hexagonal)

```mermaid
flowchart TB
  subgraph presentation[presentation]
    controller[Controller + DTO Zod]
  end
  subgraph application[application]
    usecase[Servicio / Facade]
    port{{Puerto: interfaz + token DI}}
  end
  subgraph domain[domain]
    entity[Value Objects, State, Strategy, reglas]
  end
  subgraph infrastructure[infrastructure]
    adapter[Adaptador Drizzle / HTTP]
  end
  controller --> usecase --> entity
  usecase --> port
  adapter -. implementa .-> port
```

El dominio no importa NestJS ni Drizzle. Los adaptadores se enlazan a los puertos en el
`*.module.ts` (`{ provide: TOKEN, useClass: Adaptador }`), así que cambiar la base de
datos o la fuente de mercado no toca la lógica de negocio.

## Flujo de compra

```mermaid
sequenceDiagram
  participant W as Web
  participant C as OrdersController
  participant F as PurchaseFacade
  participant V as Cadena de validadores
  participant R as DrizzleOrderRepository
  participant L as SalesStatsListener
  W->>C: POST /api/orders (JWT)
  C->>F: purchase(items, usuario)
  F->>V: cantidad → publicado → propio → precio → stock
  F->>R: place() en una transacción
  R->>R: UPDATE stock condicional (sin sobreventa)
  F-->>L: evento order.placed
  L->>L: REFRESH MATERIALIZED VIEW sales_stats
  C-->>W: 201 pedido
```

## Recomendaciones

```mermaid
flowchart LR
  prefs[Preferencias del usuario] --> factory[Factory Method]
  factory --> composite[WeightedCompositeStrategy]
  composite --> m[MarketPopularity<br/>parque automotor real]
  composite --> s[StoreSales<br/>ventas internas]
  composite --> p[PreferenceMatch<br/>marca, modelo, color, presupuesto]
  composite --> out[Puntaje 0..1 + motivos legibles]
```

| Escenario | Preferencias | Mercado | Ventas tienda |
|---|---|---|---|
| Sin preferencias | – | 70 % | 30 % |
| Con preferencias | 60 % | 30 % | 10 % |

## Modelo de datos

```mermaid
erDiagram
  brands ||--o{ models : tiene
  models ||--o{ vehicles : "se vende como"
  colors ||--o{ vehicles : pinta
  vehicles ||--o{ vehicle_prices : historial
  profiles ||--o{ orders : compra
  orders ||--|{ order_items : contiene
  vehicles ||--o{ order_items : "se vende en"
  profiles ||--o| user_preferences : prefiere
  market_stats }o..o{ models : "se cruza por marca+modelo+color"
```

Para diagramas interactivos (rutas, foco upstream/downstream, exportar PNG/PDF) se usa
[Archify](https://github.com/tt-a1i/archify): `npx skills add tt-a1i/archify -g` y luego
pedir en Claude Code "mapea la arquitectura de este repositorio".
