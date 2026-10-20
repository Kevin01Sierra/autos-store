import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';

export function useVehicle(id: string) {
  const { vehicles } = useServices();
  return useQuery({ queryKey: queryKeys.vehicle(id), queryFn: () => vehicles.get(id) });
}

export function usePriceHistory(id: string) {
  const { vehicles } = useServices();
  return useQuery({ queryKey: queryKeys.prices(id), queryFn: () => vehicles.prices(id) });
}

export function usePurchase(vehicleId: string) {
  const { orders } = useServices();
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (quantity: number) => orders.purchase({ items: [{ vehicleId, quantity }] }),
    onSuccess: () => {
      toast.success('¡Compra registrada! Te contactaremos para la entrega.');
      void client.invalidateQueries({ queryKey: ['vehicles'] });
      void client.invalidateQueries({ queryKey: queryKeys.vehicle(vehicleId) });
      void client.invalidateQueries({ queryKey: queryKeys.orders });
      void navigate('/mis-pedidos');
    },
    onError: (error) => toast.error(error.message),
  });
}
