import type { PreferencesDto } from '@autos/contracts';
import type { VehicleQuery } from './endpoints/vehicles.api';

/** Claves de caché centralizadas para invalidar de forma consistente. */
export const queryKeys = {
  brands: ['brands'] as const,
  models: (brandId?: string) => ['models', brandId ?? 'all'] as const,
  colors: ['colors'] as const,
  vehicles: (query: VehicleQuery) => ['vehicles', query] as const,
  vehicle: (id: string) => ['vehicle', id] as const,
  prices: (id: string) => ['prices', id] as const,
  recommendations: (preferences: PreferencesDto | 'me') => ['recommendations', preferences] as const,
  market: (query: object) => ['market', query] as const,
  orders: ['orders'] as const,
  adminMetrics: ['admin', 'metrics'] as const,
};
