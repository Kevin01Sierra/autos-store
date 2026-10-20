# ADR 0002: Supabase y Vercel en plan gratuito

- Estado: aceptado (2026-10-20)

## Decisión
Postgres y Auth en Supabase; web y API en Vercel (la API como función serverless).

## Consecuencias
- Conexión por el pooler de Supabase en modo transaction (`prepare: false`, `max: 5`).
- Supabase pausa proyectos inactivos 7 días: un workflow hace ping a `/api/health` cada 3 días.
- Las funciones tienen tiempo limitado: la sincronización con datos.gov.co corre en un cron
  semanal y nunca dentro de la petición de un usuario.
- La API valida los JWT con el JWKS público de Supabase; no guarda secretos de firma.
