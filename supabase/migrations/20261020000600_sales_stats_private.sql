-- Las vistas materializadas no tienen RLS: sales_stats solo la lee la API, no la Data API pública.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.sales_stats from anon, authenticated;
  end if;
end $$;
