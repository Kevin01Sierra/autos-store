# Guía para agentes y colaboradores

## Reglas no negociables
- Ningún archivo de código supera **60 líneas** (`pnpm check:lines`). Funciones ≤ 40 líneas, complejidad ≤ 8.
- Backend hexagonal: `domain` no importa Nest ni Drizzle. Los adaptadores se enlazan a puertos en el `*.module.ts`.
- Validación con los esquemas Zod de `packages/contracts`, compartidos por API y web.
- Un caso de uso, controlador o componente por archivo. Nombres en inglés, textos de UI en español.
- Usa un patrón de diseño solo cuando resuelve un problema concreto; documenta en `docs/patterns.md`.

## Comandos
- `pnpm dev` — API (3000) y web (5173).
- `pnpm turbo run lint typecheck test build` — lo mismo que corre CI.
- `DATABASE_URL=... scripts/db-setup.sh` — migraciones + seed en un Postgres local.
- `pnpm --filter @autos/web e2e` — Playwright (requiere API y `vite preview` en marcha).

## Flujo recomendado (agent-skills)
`/spec` → `/plan` → `/build` → `/test` → `/agent-skills:review` → `/ship`. Antes de abrir PR: `/ponytail-review`.
