-- Marcas y modelos con mayor presencia en el mercado colombiano.
insert into public.brands (name, slug, country) values
  ('Renault', 'renault', 'Francia'), ('Kia', 'kia', 'Corea del Sur'),
  ('Mazda', 'mazda', 'Japón'), ('Chevrolet', 'chevrolet', 'Estados Unidos'),
  ('Toyota', 'toyota', 'Japón'), ('Suzuki', 'suzuki', 'Japón'),
  ('Hyundai', 'hyundai', 'Corea del Sur'), ('Nissan', 'nissan', 'Japón'),
  ('Volkswagen', 'volkswagen', 'Alemania'), ('BYD', 'byd', 'China');

insert into public.models (brand_id, name, slug, body_type, fuel_type)
select b.id, m.name, m.slug, m.body, m.fuel
from (values
  ('renault', 'Duster', 'renault-duster', 'suv', 'gasoline'),
  ('renault', 'Kwid', 'renault-kwid', 'hatchback', 'gasoline'),
  ('renault', 'Logan', 'renault-logan', 'sedan', 'gasoline'),
  ('kia', 'Picanto', 'kia-picanto', 'hatchback', 'gasoline'),
  ('kia', 'Sportage', 'kia-sportage', 'suv', 'hybrid'),
  ('mazda', 'Mazda 2', 'mazda-2', 'sedan', 'gasoline'),
  ('mazda', 'CX-30', 'mazda-cx-30', 'suv', 'gasoline'),
  ('chevrolet', 'Tracker', 'chevrolet-tracker', 'suv', 'gasoline'),
  ('chevrolet', 'Onix', 'chevrolet-onix', 'sedan', 'gasoline'),
  ('toyota', 'Corolla Cross', 'toyota-corolla-cross', 'suv', 'hybrid'),
  ('toyota', 'Hilux', 'toyota-hilux', 'pickup', 'diesel'),
  ('suzuki', 'Swift', 'suzuki-swift', 'hatchback', 'hybrid'),
  ('hyundai', 'Tucson', 'hyundai-tucson', 'suv', 'gasoline'),
  ('nissan', 'Kicks', 'nissan-kicks', 'suv', 'gasoline'),
  ('volkswagen', 'T-Cross', 'volkswagen-t-cross', 'suv', 'gasoline'),
  ('byd', 'Dolphin', 'byd-dolphin', 'hatchback', 'electric')
) as m(brand_slug, name, slug, body, fuel)
join public.brands b on b.slug = m.brand_slug;

insert into public.colors (name, hex) values
  ('Blanco', '#F5F5F5'), ('Negro', '#111111'), ('Gris', '#7A7F87'),
  ('Plata', '#C0C4CA'), ('Rojo', '#B3202A'), ('Azul', '#1F4E9C');
