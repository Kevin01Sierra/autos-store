-- Solo para CI/local sin Supabase: emula el esquema auth que Supabase ya trae.
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
