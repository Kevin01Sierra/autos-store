import type { PreferencesDto } from '@autos/contracts';

export interface SalesStatsReader {
  /** Unidades vendidas en la tienda por clave modelId|colorId. */
  unitsByModelColor(): Promise<Map<string, number>>;
  refresh(): Promise<void>;
}

export interface PreferencesRepository {
  find(userId: string): Promise<PreferencesDto | null>;
  save(userId: string, preferences: PreferencesDto): Promise<PreferencesDto>;
}

export const SALES_STATS_READER = Symbol('SALES_STATS_READER');
export const PREFERENCES_REPOSITORY = Symbol('PREFERENCES_REPOSITORY');

export const EMPTY_PREFERENCES: PreferencesDto = { brandIds: [], modelIds: [], colorIds: [] };
