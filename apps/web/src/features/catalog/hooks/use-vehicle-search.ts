import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import type { VehicleQuery } from '@/shared/api/endpoints/vehicles.api';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';

const TEXT_KEYS = ['brandId', 'modelId', 'colorId', 'search'] as const;
const NUMBER_KEYS = ['minPrice', 'maxPrice', 'minYear', 'page'] as const;

/** Los filtros viven en la URL: se pueden compartir, guardar y navegar con atrás/adelante. */
export function useVehicleSearch() {
  const [params, setParams] = useSearchParams();
  const query: VehicleQuery = { pageSize: 12 };
  TEXT_KEYS.forEach((key) => (query[key] = params.get(key) ?? undefined));
  NUMBER_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) query[key] = Number(value);
  });

  const { vehicles } = useServices();
  const result = useQuery({
    queryKey: queryKeys.vehicles(query),
    queryFn: () => vehicles.search(query),
    placeholderData: keepPreviousData,
  });

  const setFilter = (key: string, value?: string) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      if (key === 'brandId') next.delete('modelId');
      return next;
    });

  const clear = () => setParams(new URLSearchParams());
  return { query, result, setFilter, clear };
}
