-- Datos de DEMOSTRACIÓN para el ranking de mercado mientras no se sincroniza
-- la fuente real (POST /market/sync). Las unidades son estimaciones, no cifras oficiales.
insert into public.market_stats (brand, model, color, period, units, source)
select brand, model, color, period::date, units, 'demo'
from (values
  ('Kia', 'Picanto', 'Blanco', '2026-09-01', 1450),
  ('Kia', 'Picanto', 'Rojo', '2026-09-01', 720),
  ('Renault', 'Duster', 'Gris', '2026-09-01', 1180),
  ('Renault', 'Duster', 'Blanco', '2026-09-01', 860),
  ('Mazda', 'Mazda 2', 'Rojo', '2026-09-01', 1120),
  ('Mazda', 'Mazda 2', 'Gris', '2026-09-01', 640),
  ('Toyota', 'Corolla Cross', 'Blanco', '2026-09-01', 980),
  ('Toyota', 'Corolla Cross', 'Plata', '2026-09-01', 540),
  ('Chevrolet', 'Tracker', 'Blanco', '2026-09-01', 910),
  ('Renault', 'Kwid', 'Rojo', '2026-09-01', 690),
  ('Suzuki', 'Swift', 'Azul', '2026-09-01', 610),
  ('Nissan', 'Kicks', 'Rojo', '2026-09-01', 450),
  ('Mazda', 'CX-30', 'Gris', '2026-09-01', 520),
  ('Chevrolet', 'Onix', 'Azul', '2026-09-01', 430),
  ('BYD', 'Dolphin', 'Azul', '2026-09-01', 380),
  ('Volkswagen', 'T-Cross', 'Plata', '2026-09-01', 360),
  ('Hyundai', 'Tucson', 'Gris', '2026-09-01', 300),
  ('Kia', 'Sportage', 'Negro', '2026-09-01', 340),
  ('Toyota', 'Hilux', 'Negro', '2026-09-01', 420),
  ('Renault', 'Logan', 'Plata', '2026-09-01', 280)
) as t(brand, model, color, period, units);
