import type { PreferencesDto } from '@autos/contracts';
import { MarketPopularityStrategy } from '../domain/strategies/market-popularity.strategy.js';
import { PreferenceMatchStrategy } from '../domain/strategies/preference-match.strategy.js';
import { StoreSalesStrategy } from '../domain/strategies/store-sales.strategy.js';
import { WeightedCompositeStrategy } from '../domain/strategies/weighted-composite.strategy.js';

const hasPreferences = (p: PreferencesDto): boolean =>
  p.brandIds.length + p.modelIds.length + p.colorIds.length > 0 || p.maxBudget !== undefined;

/**
 * Factory Method: decide qué combinación de estrategias usar según lo que eligió el usuario.
 * Sin preferencias manda la popularidad; con preferencias pesa más la coincidencia.
 */
export function createRecommendationStrategy(preferences: PreferencesDto) {
  const market = new MarketPopularityStrategy();
  const sales = new StoreSalesStrategy();
  if (!hasPreferences(preferences)) {
    return new WeightedCompositeStrategy([
      { strategy: market, weight: 0.7 },
      { strategy: sales, weight: 0.3 },
    ]);
  }
  return new WeightedCompositeStrategy([
    { strategy: new PreferenceMatchStrategy(), weight: 0.6 },
    { strategy: market, weight: 0.3 },
    { strategy: sales, weight: 0.1 },
  ]);
}
