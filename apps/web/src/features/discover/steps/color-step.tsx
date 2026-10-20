import { ColorSwatches } from '@/features/catalog/components/color-swatches';
import { useColors } from '@/shared/hooks/use-catalog';
import { toggleIn } from '../preferences-store';
import type { StepProps } from './vehicle-step';

/** Paso 2: colores preferidos (selección múltiple). */
export function ColorStep({ value, onChange }: StepProps) {
  const colors = useColors().data ?? [];
  const names = colors.filter((c) => value.colorIds.includes(c.id)).map((c) => c.name);
  return (
    <div className="space-y-4">
      <ColorSwatches colors={colors} selected={value.colorIds}
        onSelect={(id) => onChange({ ...value, colorIds: toggleIn(value.colorIds, id) })} />
      <p className="text-sm text-fg-muted">
        {names.length ? `Elegiste: ${names.join(', ')}` : 'Puedes elegir varios o saltar este paso.'}
      </p>
    </div>
  );
}
