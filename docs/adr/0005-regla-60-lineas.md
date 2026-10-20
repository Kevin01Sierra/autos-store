# ADR 0005: Máximo 60 líneas por archivo

- Estado: aceptado (2026-10-20)

## Decisión
Ningún archivo de código (`.ts`, `.tsx`, `.sql`, `.css`, `.yml`, `.mjs`) supera 60 líneas.
Se aplica con ESLint (`max-lines`, `max-lines-per-function: 40`, `complexity: 8`) y con
`scripts/check-max-lines.mjs`, que corre en CI y falla el pipeline.

## Consecuencias
- Obliga a separar responsabilidades (SRP) y a extraer componentes y funciones con nombre.
- Markdown y JSON de configuración quedan fuera de la regla.
