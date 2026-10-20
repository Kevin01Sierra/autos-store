-- Inventario: vehículos con stock e historial de precios.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('admin','customer')),
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models (id) on delete restrict,
  color_id uuid not null references public.colors (id) on delete restrict,
  seller_id uuid references public.profiles (id) on delete set null,
  year int not null check (year between 1990 and 2100),
  mileage_km int not null default 0 check (mileage_km >= 0),
  transmission text not null check (transmission in ('manual','automatic')),
  stock int not null check (stock >= 0),
  status text not null default 'published' check (status in ('draft','published','archived')),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.vehicle_prices (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'COP',
  valid_from timestamptz not null default now(),
  valid_to timestamptz
);

-- Solo un precio vigente por vehículo.
create unique index vehicle_prices_current_idx
  on public.vehicle_prices (vehicle_id) where valid_to is null;
create index vehicles_model_idx on public.vehicles (model_id);
create index vehicles_color_idx on public.vehicles (color_id);
