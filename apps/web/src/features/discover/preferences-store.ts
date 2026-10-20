import type { PreferencesDto } from '@autos/contracts';
import { createLocalStore } from '@/shared/hooks/use-local-store';

export const EMPTY_PREFERENCES: PreferencesDto = { brandIds: [], modelIds: [], colorIds: [] };

/** Preferencias del onboarding; se guardan localmente aunque el usuario no tenga cuenta. */
export const preferencesStore = createLocalStore<PreferencesDto>('rueda-preferences', EMPTY_PREFERENCES);

export const toggleIn = (list: string[], id: string): string[] =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id].slice(-5);

export const hasPreferences = (p: PreferencesDto): boolean =>
  p.brandIds.length + p.modelIds.length + p.colorIds.length > 0 || p.maxBudget !== undefined;
