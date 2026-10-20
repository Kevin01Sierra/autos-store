# Despliegue (planes gratuitos)

## 1. Supabase
1. Crea un proyecto en supabase.com.
2. SQL Editor: ejecuta en orden `supabase/migrations/*.sql` y luego `supabase/seed/*.sql`
   (o `supabase db push` con la CLI). **No ejecutes** `supabase/ci/auth-stub.sql`: es solo para CI.
3. Crea tu usuario desde la web y conviértelo en admin:
   `update public.profiles set role = 'admin' where id = '<tu-user-id>';`
4. Copia: URL del proyecto, `anon key` y la cadena del **pooler en modo transaction** (puerto 6543).

## 2. Vercel: API
- New Project → importa el repo → Root Directory `apps/api`.
- Variables: `DATABASE_URL`, `SUPABASE_URL`, `CORS_ORIGINS` (URL de la web), `CRON_SECRET`,
  y opcionalmente `MARKET_DATASET_URL` + `MARKET_FIELD_*`.
- Swagger queda en `https://<api>/api/docs`.

## 3. Vercel: web
- New Project → mismo repo → Root Directory `apps/web`.
- Variables: `VITE_API_URL=https://<api>/api`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## 4. GitHub
- Secrets del repo: `API_URL` (`https://<api>/api`) y `CRON_SECRET` para el workflow programado.
- Ejecuta "Tareas programadas" manualmente una vez para la primera sincronización de mercado.
