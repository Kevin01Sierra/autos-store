import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';

export interface MarketQuery {
  brand?: string;
  color?: string;
  limit?: number;
}

export function useMarketTop(query: MarketQuery) {
  const { market } = useServices();
  return useQuery({ queryKey: queryKeys.market(query), queryFn: () => market.top(query) });
}
