import type { VehicleQuery } from '@/shared/api/endpoints/vehicles.api';
import { useCatalogOptions } from '@/shared/hooks/use-catalog';
import { Button } from '@/shared/ui/button';
import { Field, Input, Select } from '@/shared/ui/field';
import { ColorSwatches } from './color-swatches';

interface FiltersPanelProps {
  query: VehicleQuery;
  onChange: (key: string, value?: string) => void;
  onClear: () => void;
}

const PRICE_STEPS = [60, 80, 100, 130, 160, 220].map((m) => ({
  value: String(m * 1_000_000),
  label: `$${m} millones`,
}));

export function FiltersPanel({ query, onChange, onClear }: FiltersPanelProps) {
  const { brandOptions, modelOptions, colors } = useCatalogOptions(query.brandId);
  const bind = (key: keyof VehicleQuery) => ({
    value: query[key] === undefined ? '' : String(query[key]),
    onChange: (e: { target: { value: string } }) => onChange(key, e.target.value || undefined),
  });
  return (
    <aside className="flex flex-col gap-5" aria-label="Filtros">
      <Field label="Buscar">
        <Input type="search" placeholder="Marca o modelo" defaultValue={query.search}
          onKeyDown={(e) => e.key === 'Enter' && onChange('search', e.currentTarget.value || undefined)} />
      </Field>
      <Field label="Marca">
        <Select options={brandOptions} placeholder="Todas" {...bind('brandId')} />
      </Field>
      <Field label="Modelo">
        <Select options={modelOptions} placeholder="Todos" disabled={!query.brandId} {...bind('modelId')} />
      </Field>
      <Field label="Color">
        <ColorSwatches colors={colors} selected={query.colorId}
          onSelect={(id) => onChange('colorId', id === query.colorId ? undefined : id)} />
      </Field>
      <Field label="Precio máximo">
        <Select options={PRICE_STEPS} placeholder="Sin límite" {...bind('maxPrice')} />
      </Field>
      <Button variant="ghost" onClick={onClear}>Limpiar filtros</Button>
    </aside>
  );
}
