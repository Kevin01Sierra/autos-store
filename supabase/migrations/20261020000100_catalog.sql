-- Catálogo: marcas, modelos y colores.
create extension if not exists pgcrypto;

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  country text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table public.models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete restrict,
  name text not null,
  slug text not null unique,
  body_type text not null check (body_type in ('sedan','hatchback','suv','pickup','van','coupe')),
  fuel_type text not null check (fuel_type in ('gasoline','diesel','hybrid','electric')),
  created_at timestamptz not null default now(),
  unique (brand_id, name)
);

create table public.colors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  hex text not null check (hex ~ '^#[0-9a-fA-F]{6}$')
);

create index models_brand_idx on public.models (brand_id);
