-- Row Level Security: lectura pública del catálogo, escritura solo vía API (service role).
alter table public.brands enable row level security;
alter table public.models enable row level security;
alter table public.colors enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_prices enable row level security;
alter table public.market_stats enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_preferences enable row level security;

create policy "catálogo público" on public.brands for select using (true);
create policy "catálogo público" on public.models for select using (true);
create policy "catálogo público" on public.colors for select using (true);
create policy "catálogo público" on public.vehicles for select using (status = 'published');
create policy "catálogo público" on public.vehicle_prices for select using (true);
create policy "mercado público" on public.market_stats for select using (true);
create policy "perfil propio" on public.profiles for select using (auth.uid() = id);
create policy "pedidos propios" on public.orders for select using (auth.uid() = customer_id);
create policy "preferencias propias" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Crea el perfil al registrarse un usuario.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
