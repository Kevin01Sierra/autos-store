import type { BrandDto, ColorDto, ModelDto } from '@autos/contracts';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';
import { useBrands } from '@/shared/hooks/use-catalog';
import { BODY_LABELS, FUEL_LABELS } from '@/shared/lib/labels';
import { ColorDot } from '@/shared/ui/color-dot';
import { AdminShell } from '../admin-shell';
import type { ResourceConfig } from './resource-config';
import { ResourceManager } from './resource-manager';

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export default function AdminCatalogPage() {
  const services = useServices();
  const brandOptions = (useBrands().data ?? []).map((b) => ({ value: b.id, label: b.name }));
  const brands: ResourceConfig<BrandDto> = {
    title: 'Marcas', queryKey: queryKeys.brands, api: services.brands, headers: ['Nombre', 'País'],
    fields: [{ name: 'name', label: 'Nombre' }, { name: 'country', label: 'País' }],
    row: (b) => [b.name, b.country],
  };
  const models: ResourceConfig<ModelDto> = {
    title: 'Modelos', queryKey: queryKeys.models(), api: services.models, headers: ['Modelo', 'Marca', 'Tipo'],
    fields: [
      { name: 'brandId', label: 'Marca', type: 'select', options: brandOptions },
      { name: 'name', label: 'Nombre' },
      { name: 'bodyType', label: 'Carrocería', type: 'select', options: toOptions(BODY_LABELS) },
      { name: 'fuelType', label: 'Combustible', type: 'select', options: toOptions(FUEL_LABELS) },
    ],
    row: (m) => [m.name, m.brandName, `${BODY_LABELS[m.bodyType]} · ${FUEL_LABELS[m.fuelType]}`],
  };
  const colors: ResourceConfig<ColorDto> = {
    title: 'Colores', queryKey: queryKeys.colors, api: services.colors, headers: ['Color', 'Hex'],
    fields: [{ name: 'name', label: 'Nombre' }, { name: 'hex', label: 'Color', type: 'color' }],
    row: (c) => [<span key="c" className="flex items-center gap-2"><ColorDot hex={c.hex} />{c.name}</span>, c.hex],
  };
  return (
    <AdminShell title="Catálogo base">
      <div className="grid gap-6 lg:grid-cols-2">
        <ResourceManager config={brands} />
        <ResourceManager config={colors} />
        <div className="lg:col-span-2"><ResourceManager config={models} /></div>
      </div>
    </AdminShell>
  );
}
