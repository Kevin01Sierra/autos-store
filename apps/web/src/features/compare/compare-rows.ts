import type { VehicleDto } from '@autos/contracts';
import { formatKm, formatPrice } from '@/shared/lib/format';
import { BODY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from '@/shared/lib/labels';

export interface CompareRow {
  label: string;
  value: (v: VehicleDto) => string;
  /** Devuelve el número a optimizar y si se busca el mínimo o el máximo. */
  best?: { of: (v: VehicleDto) => number; prefer: 'min' | 'max' };
}

export const COMPARE_ROWS: CompareRow[] = [
  { label: 'Precio', value: (v) => formatPrice(v.price), best: { of: (v) => v.price, prefer: 'min' } },
  { label: 'Año', value: (v) => String(v.year), best: { of: (v) => v.year, prefer: 'max' } },
  { label: 'Kilometraje', value: (v) => formatKm(v.mileageKm), best: { of: (v) => v.mileageKm, prefer: 'min' } },
  { label: 'Carrocería', value: (v) => BODY_LABELS[v.bodyType] ?? v.bodyType },
  { label: 'Combustible', value: (v) => FUEL_LABELS[v.fuelType] ?? v.fuelType },
  { label: 'Transmisión', value: (v) => TRANSMISSION_LABELS[v.transmission] ?? v.transmission },
  { label: 'Color', value: (v) => v.colorName },
  { label: 'Disponibles', value: (v) => `${v.stock} unidades` },
];

export function bestIds(row: CompareRow, vehicles: VehicleDto[]): Set<string> {
  if (!row.best || vehicles.length < 2) return new Set();
  const values = vehicles.map(row.best.of);
  const target = row.best.prefer === 'min' ? Math.min(...values) : Math.max(...values);
  return new Set(vehicles.filter((v) => row.best!.of(v) === target).map((v) => v.id));
}
