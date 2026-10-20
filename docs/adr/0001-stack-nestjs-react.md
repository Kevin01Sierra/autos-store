# ADR 0001: NestJS + React con TypeScript de punta a punta

- Estado: aceptado (2026-10-20)

## Contexto
La prueba exige bases sólidas de backend y frontend, inyección de dependencias, patrones de
diseño y archivos de máximo 60 líneas. Se evaluaron Django, NestJS, React y Angular.

## Decisión
NestJS 12 en el backend y React 19 + Vite en el frontend, compartiendo contratos Zod en
`packages/contracts`.

## Consecuencias
- DI nativa en Nest; en React se resuelve con un contenedor de servicios y Context.
- Un solo lenguaje y un solo esquema de validación para front y back.
- Archivos pequeños por diseño (un caso de uso o componente por archivo).
