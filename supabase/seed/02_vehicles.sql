-- Inventario inicial de la tienda con su precio vigente (COP).
with data (model_slug, color, year, km, trans, stock, price) as (values
  ('renault-duster', 'Gris', 2026, 0, 'manual', 6, 92900000),
  ('renault-duster', 'Blanco', 2026, 0, 'automatic', 4, 104900000),
  ('renault-kwid', 'Rojo', 2026, 0, 'manual', 8, 56900000),
  ('renault-logan', 'Plata', 2025, 12000, 'manual', 3, 58500000),
  ('kia-picanto', 'Blanco', 2026, 0, 'manual', 10, 64900000),
  ('kia-picanto', 'Rojo', 2026, 0, 'automatic', 5, 71900000),
  ('kia-sportage', 'Negro', 2026, 0, 'automatic', 3, 169900000),
  ('mazda-2', 'Rojo', 2026, 0, 'automatic', 7, 89900000),
  ('mazda-2', 'Gris', 2025, 18000, 'automatic', 2, 78000000),
  ('mazda-cx-30', 'Gris', 2026, 0, 'automatic', 4, 139900000),
  ('chevrolet-tracker', 'Blanco', 2026, 0, 'automatic', 6, 109900000),
  ('chevrolet-onix', 'Azul', 2026, 0, 'manual', 5, 74900000),
  ('toyota-corolla-cross', 'Blanco', 2026, 0, 'automatic', 5, 149900000),
  ('toyota-corolla-cross', 'Plata', 2026, 0, 'automatic', 3, 154900000),
  ('toyota-hilux', 'Negro', 2026, 0, 'manual', 2, 219900000),
  ('suzuki-swift', 'Azul', 2026, 0, 'manual', 6, 74900000),
  ('hyundai-tucson', 'Gris', 2025, 9000, 'automatic', 2, 135000000),
  ('nissan-kicks', 'Rojo', 2026, 0, 'automatic', 4, 104900000),
  ('volkswagen-t-cross', 'Plata', 2026, 0, 'automatic', 3, 119900000),
  ('byd-dolphin', 'Azul', 2026, 0, 'automatic', 4, 119900000)
),
inserted as (
  insert into public.vehicles (model_id, color_id, year, mileage_km, transmission, stock)
  select m.id, c.id, d.year, d.km, d.trans, d.stock
  from data d
  join public.models m on m.slug = d.model_slug
  join public.colors c on c.name = d.color
  returning id, model_id, color_id, year, mileage_km
)
insert into public.vehicle_prices (vehicle_id, amount)
select i.id, d.price
from inserted i
join public.models m on m.id = i.model_id
join public.colors c on c.id = i.color_id
join data d on d.model_slug = m.slug and d.color = c.name
  and d.year = i.year and d.km = i.mileage_km;
