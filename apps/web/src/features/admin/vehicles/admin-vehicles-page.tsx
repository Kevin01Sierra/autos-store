import { Plus } from 'lucide-react';
import { useState } from 'react';
import { VehicleForm } from '@/features/sell/vehicle-form';
import { VEHICLE_STATUS_LABELS } from '@/shared/lib/labels';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ErrorState, Skeleton } from '@/shared/ui/feedback';
import { AdminShell } from '../admin-shell';
import { useAdminVehicles, useVehicleMutations, type Status } from './use-admin-vehicles';
import { VehicleRow } from './vehicle-row';

const STATUSES: Status[] = ['published', 'draft', 'archived'];

export default function AdminVehiclesPage() {
  const [status, setStatus] = useState<Status>('published');
  const [adding, setAdding] = useState(false);
  const { data, isLoading, error } = useAdminVehicles(status);
  const { create } = useVehicleMutations();
  return (
    <AdminShell title="Inventario de vehículos">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <Button key={s} size="sm" variant={s === status ? 'dark' : 'outline'} onClick={() => setStatus(s)}>
            {VEHICLE_STATUS_LABELS[s]}
          </Button>
        ))}
        <Button size="sm" className="ml-auto" onClick={() => setAdding(!adding)}><Plus className="size-4" /> Registrar vehículo</Button>
      </div>
      {adding && (
        <Card className="mb-6 p-6">
          <VehicleForm submitLabel="Agregar al inventario" pending={create.isPending}
            onSubmit={(d) => create.mutate(d, { onSuccess: () => setAdding(false) })} />
        </Card>
      )}
      {error && <ErrorState error={error} />}
      <Card className="overflow-x-auto">
        {isLoading ? <Skeleton className="m-4 h-60" /> : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs text-fg-muted">
              <tr>{['Vehículo', 'Stock', 'Precio (COP)', ''].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>{data?.items.map((v) => <VehicleRow key={`${v.id}-${v.stock}-${v.price}`} vehicle={v} />)}</tbody>
          </table>
        )}
      </Card>
    </AdminShell>
  );
}
