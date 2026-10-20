import type { VehicleDto } from '@autos/contracts';
import { formatKm } from '@/shared/lib/format';
import { BODY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from '@/shared/lib/labels';

export function SpecList({ vehicle: v }: { vehicle: VehicleDto }) {
  const specs = [
    ['Año', String(v.year)],
    ['Kilometraje', formatKm(v.mileageKm)],
    ['Carrocería', BODY_LABELS[v.bodyType] ?? v.bodyType],
    ['Combustible', FUEL_LABELS[v.fuelType] ?? v.fuelType],
    ['Transmisión', TRANSMISSION_LABELS[v.transmission] ?? v.transmission],
    ['Color', v.colorName],
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
      {specs.map(([label, value]) => (
        <div key={label} className="bg-surface-raised p-4">
          <dt className="text-xs text-fg-muted">{label}</dt>
          <dd className="mt-1 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
