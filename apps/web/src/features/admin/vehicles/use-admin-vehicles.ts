import type { CreateVehicleDto, UpdateVehicleDto } from '@autos/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useServices } from '@/shared/api/services-context';

type Status = 'published' | 'draft' | 'archived';

export function useAdminVehicles(status: Status) {
  const { vehicles } = useServices();
  return useQuery({
    queryKey: ['vehicles', 'manage', status],
    queryFn: () => vehicles.manage({ status, onlyAvailable: false, pageSize: 50 }),
  });
}

/** Todas las mutaciones del inventario invalidan la misma caché. */
export function useVehicleMutations() {
  const { vehicles } = useServices();
  const client = useQueryClient();
  const options = {
    onSuccess: () => {
      toast.success('Inventario actualizado');
      void client.invalidateQueries({ queryKey: ['vehicles'] });
      void client.invalidateQueries({ queryKey: ['vehicle'] });
      void client.invalidateQueries({ queryKey: ['admin'] });
    },
    onError: (error: Error) => toast.error(error.message),
  };
  return {
    create: useMutation({ mutationFn: (d: CreateVehicleDto) => vehicles.register(d), ...options }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) => vehicles.update(id, data),
      ...options,
    }),
    setPrice: useMutation({
      mutationFn: ({ id, amount }: { id: string; amount: number }) => vehicles.setPrice(id, amount),
      ...options,
    }),
    archive: useMutation({ mutationFn: (id: string) => vehicles.archive(id), ...options }),
  };
}

export type { Status };
