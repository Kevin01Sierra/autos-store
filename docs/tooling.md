# Herramientas de desarrollo con IA

En las sesiones de Claude Code en la nube, `.claude/hooks/session-start.sh` instala automáticamente las dependencias, agent-skills, Ponytail, Graphify y Archify. En local, sigue la columna "Cómo se activa".

| Herramienta | Para qué la usamos | Cómo se activa |
|---|---|---|
| [agent-skills](https://github.com/addyosmani/agent-skills) | Flujo spec → plan → build → test → review → ship; skills de frontend/UI, API, TDD, CI/CD, seguridad. | Ya declarado en `.claude/settings.json`; Claude Code ofrece instalarlo al abrir el repo. |
| [Ponytail](https://github.com/dietrichgebert/ponytail) | Escribir solo el código necesario; `/ponytail-review` antes de cada PR. Encaja con la regla de 60 líneas. | Ya declarado en `.claude/settings.json`. |
| [Archify](https://github.com/tt-a1i/archify) | Diagramas interactivos de arquitectura, ERD, secuencia y flujo de datos. | `npx skills add tt-a1i/archify -g` |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Grafo de conocimiento del código para revisar acoplamientos. | `uv tool install graphifyy && graphify install`, luego `/graphify .` |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Memoria persistente entre sesiones locales de Claude Code. | `npx claude-mem install` (local, pide registro). |
| [OmniRoute](https://github.com/diegosouzapw/OmniRoute) | Gateway opcional para enrutar herramientas de IA entre proveedores. No forma parte de la app. | Solo en el entorno local de cada desarrollador. |
| Skill `frontend-design` / `ui-ux-pro-max` | Criterio visual y de UX al construir pantallas. | Instalar desde el marketplace de plugins de Claude Code. |

## Conectores MCP sugeridos
- **Supabase**: inspeccionar tablas, ejecutar migraciones y revisar logs.
- **Vercel**: revisar despliegues y logs de funciones.
- **Firecrawl**: investigar fuentes de datos de mercado y referencias de la competencia.
- **Figma**: llevar el design system a componentes.
- **Playwright**: se usa como dependencia de pruebas E2E (`apps/web/e2e`), no requiere conector.
