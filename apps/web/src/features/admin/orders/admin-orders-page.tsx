import type { OrderStatus } from '@autos/contracts';
import { OrderCard } from '@/features/orders/order-card';
import { useChangeOrderStatus, useOrders } from '@/features/orders/use-orders';
import { STATUS_LABELS } from '@/shared/lib/labels';
import { Button } from '@/shared/ui/button';
import { ErrorState, Skeleton } from '@/shared/ui/feedback';
import { AdminShell } from '../admin-shell';

/** Transiciones permitidas por estado; el backend vuelve a validarlas (patrón State). */
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'], paid: ['delivered', 'cancelled'], delivered: [], cancelled: [],
};

export default function AdminOrdersPage() {
  const { data, isLoading, error } = useOrders();
  const change = useChangeOrderStatus();
  return (
    <AdminShell title="Pedidos">
      {isLoading && <Skeleton className="h-40" />}
      {error && <ErrorState error={error} />}
      {data?.length === 0 && <p className="text-fg-muted">No hay pedidos todavía.</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        {data?.map((order) => (
          <OrderCard key={order.id} order={order} actions={NEXT[order.status].map((status) => (
            <Button key={status} size="sm" variant={status === 'cancelled' ? 'outline' : 'dark'}
              disabled={change.isPending} onClick={() => change.mutate({ id: order.id, status })}>
              Marcar {STATUS_LABELS[status].toLowerCase()}
            </Button>
          ))} />
        ))}
      </div>
    </AdminShell>
  );
}
