# ADR 0003: Arquitectura hexagonal por módulo

- Estado: aceptado (2026-10-20)

## Decisión
Cada módulo se divide en `domain`, `application` (casos de uso + puertos), `infrastructure`
(adaptadores) y `presentation` (controladores). Los puertos son interfaces con un token
`Symbol` que Nest resuelve en el `*.module.ts`.

## Consecuencias
- Las reglas de negocio se prueban sin base de datos (ver `apps/api/test/unit`).
- Cambiar Drizzle o la fuente de mercado solo afecta a `infrastructure`.
