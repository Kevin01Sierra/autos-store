import { useQuery } from '@tanstack/react-query';
import { Car, ClipboardCheck, Receipt, Warehouse } from 'lucide-react';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';
import { formatCompactPrice, formatNumber } from '@/shared/lib/format';
import { ErrorState, Skeleton } from '@/shared/ui/feedback';
import { AdminShell } from '../admin-shell';
import { LowStockCard, TopSoldCard } from './dashboard-lists';
import { StatTile } from './stat-tile';

export default function DashboardPage() {
  const { admin } = useServices();
  const { data: m, isLoading, error } = useQuery({ queryKey: queryKeys.adminMetrics, queryFn: admin.metrics });
  return (
    <AdminShell title="Resumen de la tienda">
      {isLoading && <Skeleton className="h-32" />}
      {error && <ErrorState error={error} />}
      {m && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={Car} label="Vehículos publicados" value={formatNumber(m.publishedVehicles)} />
            <StatTile icon={Warehouse} label="Unidades en stock" value={formatNumber(m.unitsInStock)} />
            <StatTile icon={Receipt} label="Ventas" value={formatCompactPrice(m.revenue)}
              hint={`${m.orders} pedidos activos`} />
            <StatTile icon={ClipboardCheck} label="Por aprobar" value={formatNumber(m.pendingApproval)}
              hint="Autos registrados por clientes" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <LowStockCard items={m.lowStock} />
            <TopSoldCard items={m.topSold} />
          </div>
        </>
      )}
    </AdminShell>
  );
}
