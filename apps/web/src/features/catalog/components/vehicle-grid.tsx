import type { VehicleDto } from '@autos/contracts';
import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState, Skeleton } from '@/shared/ui/feedback';
import { VehicleCard } from './vehicle-card';

interface VehicleGridProps {
  vehicles?: VehicleDto[];
  loading?: boolean;
  highlights?: Record<string, string>;
  emptyAction?: ReactNode;
}

export function VehicleGrid({ vehicles, loading, highlights = {}, emptyAction }: VehicleGridProps) {
  if (loading && !vehicles) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-80" />)}
      </div>
    );
  }
  if (!vehicles?.length) {
    return (
      <EmptyState icon={SearchX} title="No encontramos autos con esos filtros"
        description="Prueba ampliar el rango de precio o quitar algún filtro." action={emptyAction} />
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} highlight={highlights[v.id]} />)}
    </div>
  );
}
