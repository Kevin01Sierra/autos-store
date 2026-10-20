import type { PreferencesDto } from '@autos/contracts';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { useServices } from '@/shared/api/services-context';

export function useRecommendations(preferences: PreferencesDto, limit = 6) {
  const { recommendations } = useServices();
  return useQuery({
    queryKey: [...queryKeys.recommendations(preferences), limit],
    queryFn: () => recommendations.recommend(preferences, limit),
  });
}
