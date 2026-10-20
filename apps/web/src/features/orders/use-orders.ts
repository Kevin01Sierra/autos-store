import type { OrderStatus } from '@autos/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';

/** Para el cliente devuelve sus pedidos; para el admin, todos. */
export function useOrders() {
  const { orders } = useServices();
  return useQuery({ queryKey: queryKeys.orders, queryFn: () => orders.list() });
}

export function useChangeOrderStatus() {
  const { orders } = useServices();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => orders.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Pedido actualizado');
      void client.invalidateQueries({ queryKey: queryKeys.orders });
      void client.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => toast.error(error.message),
  });
}
