import { Package } from 'lucide-react';
import { Link } from 'react-router';
import { Button, buttonVariants } from '@/shared/ui/button';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui/feedback';
import { OrderCard } from './order-card';
import { useChangeOrderStatus, useOrders } from './use-orders';

export default function OrdersPage() {
  const { data, isLoading, error } = useOrders();
  const change = useChangeOrderStatus();
  return (
    <div className="container-page max-w-3xl pt-12">
      <h1 className="mb-8 text-3xl font-semibold">Mis pedidos</h1>
      {isLoading && <Skeleton className="h-40" />}
      {error && <ErrorState error={error} />}
      {data?.length === 0 && (
        <EmptyState icon={Package} title="Todavía no tienes pedidos"
          action={<Link to="/autos" className={buttonVariants()}>Explorar autos</Link>} />
      )}
      <div className="flex flex-col gap-4">
        {data?.map((order) => (
          <OrderCard key={order.id} order={order} actions={
            ['pending', 'paid'].includes(order.status) && (
              <Button variant="outline" size="sm" disabled={change.isPending}
                onClick={() => change.mutate({ id: order.id, status: 'cancelled' })}>
                Cancelar pedido
              </Button>
            )
          } />
        ))}
      </div>
    </div>
  );
}
