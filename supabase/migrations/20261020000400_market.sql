-- Datos de mercado (fuentes externas) y preferencias del usuario.
create table public.market_stats (
  id bigint generated always as identity primary key,
  brand text not null,
  model text not null,
  color text,
  period date not null,
  units int not null check (units >= 0),
  source text not null,
  unique nulls not distinct (brand, model, color, period, source)
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  brand_ids uuid[] not null default '{}',
  model_ids uuid[] not null default '{}',
  color_ids uuid[] not null default '{}',
  max_budget numeric(14,2),
  updated_at timestamptz not null default now()
);

-- Ventas internas por modelo y color (se recalcula tras cada compra).
create materialized view public.sales_stats as
select v.model_id, v.color_id, sum(oi.quantity)::int as units
from public.order_items oi
join public.orders o on o.id = oi.order_id and o.status <> 'cancelled'
join public.vehicles v on v.id = oi.vehicle_id
group by v.model_id, v.color_id;

create unique index sales_stats_idx on public.sales_stats (model_id, color_id);
create index market_stats_lookup_idx on public.market_stats (lower(brand), lower(model));
