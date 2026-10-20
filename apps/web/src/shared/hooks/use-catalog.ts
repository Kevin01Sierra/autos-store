import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/query-keys';
import { useServices } from '../api/services-context';
import type { Option } from '../ui/field';

const HOUR = 60 * 60 * 1000;
const toOptions = (items: { id: string; name: string }[]): Option[] =>
  items.map((item) => ({ value: item.id, label: item.name }));

export function useBrands() {
  const { brands } = useServices();
  return useQuery({ queryKey: queryKeys.brands, queryFn: () => brands.list(), staleTime: HOUR });
}

export function useModels(brandId?: string) {
  const { models } = useServices();
  return useQuery({
    queryKey: queryKeys.models(brandId),
    queryFn: () => models.list({ brandId }),
    staleTime: HOUR,
  });
}

export function useColors() {
  const { colors } = useServices();
  return useQuery({ queryKey: queryKeys.colors, queryFn: () => colors.list(), staleTime: HOUR });
}

/** Opciones listas para selects de marca, modelo y color. */
export function useCatalogOptions(brandId?: string) {
  const brands = useBrands();
  const models = useModels(brandId);
  const colors = useColors();
  return {
    brandOptions: toOptions(brands.data ?? []),
    modelOptions: toOptions(models.data ?? []),
    colorOptions: toOptions(colors.data ?? []),
    colors: colors.data ?? [],
  };
}
