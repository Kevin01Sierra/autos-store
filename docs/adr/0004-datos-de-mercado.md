# ADR 0004: Datos reales de mercado desde datos.gov.co (RUNT)

- Estado: aceptado, con verificación pendiente de columnas (2026-10-20)

## Contexto
Las recomendaciones deben parecerse a la realidad. La matrícula de vehículos nuevos es el
mejor indicador público de "más comprados" en Colombia.

## Decisión
Un adaptador Socrata consulta un conjunto de datos de datos.gov.co agregando por marca,
modelo (línea), color y mes. URL y nombres de columna se configuran por entorno
(`MARKET_DATASET_URL`, `MARKET_FIELD_*`) porque cada conjunto usa nombres distintos.
Los datos se guardan en `market_stats` con su fuente.

## Consecuencias
- Hasta la primera sincronización se muestran datos de demostración, marcados como tales
  (`source = 'demo'`) en la interfaz.
- Pendiente: confirmar qué conjunto nacional trae marca, línea y color y fijar el mapeo.
