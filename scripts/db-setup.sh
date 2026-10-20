#!/usr/bin/env bash
# Aplica migraciones y seed en un Postgres (CI o local). Uso: DATABASE_URL=... scripts/db-setup.sh
set -euo pipefail
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/ci/auth-stub.sql
for file in supabase/migrations/*.sql supabase/seed/*.sql; do
  echo "→ $file"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$file"
done
