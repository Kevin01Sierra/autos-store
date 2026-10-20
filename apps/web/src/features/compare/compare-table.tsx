import type { VehicleDto } from '@autos/contracts';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/cn';
import { CarIllustration } from '@/shared/ui/car-illustration';
import { bestIds, COMPARE_ROWS } from './compare-rows';

interface CompareTableProps {
  vehicles: VehicleDto[];
  onRemove: (id: string) => void;
}

/** Tabla lado a lado; resalta en verde el mejor valor de cada fila. */
export function CompareTable({ vehicles, onRemove }: CompareTableProps) {
  return (
    <table className="w-full min-w-[640px] border-separate border-spacing-x-3 text-sm">
      <thead>
        <tr>
          <th className="w-36" />
          {vehicles.map((v) => (
            <th key={v.id} className="rounded-t-card bg-surface-raised p-4 text-left align-top">
              <button type="button" onClick={() => onRemove(v.id)} aria-label="Quitar" className="float-right text-fg-muted"><X className="size-4" /></button>
              <CarIllustration bodyType={v.bodyType} color={v.colorHex} label={v.modelName} className="my-2" />
              <Link to={`/autos/${v.id}`} className="font-display text-base">{v.brandName} {v.modelName}</Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COMPARE_ROWS.map((row) => {
          const best = bestIds(row, vehicles);
          return (
            <tr key={row.label}>
              <th scope="row" className="py-3 text-left font-medium text-fg-muted">{row.label}</th>
              {vehicles.map((v) => (
                <td key={v.id} className={cn('bg-surface-raised px-4 py-3 tabular', best.has(v.id) && 'font-semibold text-success')}>
                  {row.value(v)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
