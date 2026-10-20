# Patrones de diseño aplicados

Cada patrón resuelve un problema concreto del dominio. Referencia: refactoring.guru.

| Patrón | Dónde | Problema que resuelve |
|---|---|---|
| Repository + Ports & Adapters | `*/application/*.repository.ts`, `*/infrastructure/drizzle-*.ts` | Dominio independiente de Drizzle/Supabase; pruebas con dobles en memoria. |
| Template Method | `shared/application/crud.service.ts` | Flujo CRUD común; cada módulo solo define `prepareCreate`. |
| Generic Repository | `shared/database/drizzle-crud.repository.ts` | Marcas y colores sin repetir SQL. |
| Builder | `vehicles/infrastructure/vehicle-conditions.builder.ts` | Filtros del catálogo componibles; solo se agregan los enviados. |
| Value Object | `vehicles/domain/stock.ts` | El stock nunca queda negativo ni se muta. |
| Chain of Responsibility | `orders/domain/validation/*` | Reglas de compra que se agregan o reordenan sin tocar la fachada. |
| Facade | `orders/application/purchase.facade.ts` | Un único punto de entrada para comprar. |
| Unit of Work | `orders/infrastructure/drizzle-order.repository.ts` | Pedido y stock se confirman juntos; UPDATE condicional evita sobreventa. |
| State | `orders/domain/order-state.ts` | Transiciones válidas del pedido sin `if` repartidos. |
| Observer (eventos de dominio) | `order.events.ts` → `sales-stats.listener.ts` | Recalcular ventas sin acoplar pedidos con recomendaciones. |
| Strategy | `recommendations/domain/strategies/*` | Algoritmos de recomendación intercambiables. |
| Composite | `weighted-composite.strategy.ts` | Varias estrategias se comportan como una. |
| Factory Method | `recommendation-strategy.factory.ts` | Elige la combinación según lo que el usuario escogió. |
| Adapter | `market-data/infrastructure/socrata-market.source.ts` | Convierte el formato de datos.gov.co al modelo propio. |
| Decorator | `resilient-market.source.ts` | Agrega reintentos y caché a cualquier fuente. |
| CQRS ligero | `admin/admin-metrics.query.ts` | Lecturas agregadas separadas de los casos de uso de escritura. |
| Dependency Injection | API: contenedor de Nest. Web: `shared/api/services.ts` + `ServicesProvider` | Componentes y servicios piden dependencias, no las crean. |
| Observer (frontend) | `shared/hooks/use-local-store.ts` | Comparador y preferencias sincronizados en toda la app. |
