-- Compras de clientes.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending','paid','delivered','cancelled')),
  total numeric(14,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  vehicle_id uuid not null references public.vehicles (id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price > 0)
);

create index orders_customer_idx on public.orders (customer_id);
create index order_items_vehicle_idx on public.order_items (vehicle_id);
