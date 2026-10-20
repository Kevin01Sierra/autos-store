import type { PreferencesDto } from '@autos/contracts';
import { useBrands, useModels } from '@/shared/hooks/use-catalog';
import { toggleIn } from '../preferences-store';
import { Chip } from './chip';

interface StepProps {
  value: PreferencesDto;
  onChange: (next: PreferencesDto) => void;
}

/** Paso 1: marcas y modelos que le interesan al usuario. */
export function VehicleStep({ value, onChange }: StepProps) {
  const brands = useBrands().data ?? [];
  const models = (useModels().data ?? []).filter(
    (m) => value.brandIds.length === 0 || value.brandIds.includes(m.brandId),
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <Chip key={b.id} selected={value.brandIds.includes(b.id)}
            onClick={() => onChange({ ...value, brandIds: toggleIn(value.brandIds, b.id) })}>
            {b.name}
          </Chip>
        ))}
      </div>
      {value.brandIds.length > 0 && (
        <div>
          <p className="mb-3 text-sm text-fg-muted">¿Algún modelo en particular? (opcional)</p>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <Chip key={m.id} selected={value.modelIds.includes(m.id)}
                onClick={() => onChange({ ...value, modelIds: toggleIn(value.modelIds, m.id) })}>
                {m.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { StepProps };
