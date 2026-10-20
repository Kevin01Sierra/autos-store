import type { VehicleDto } from '@autos/contracts';
import { popularityKey } from '../../../market-data/domain/market-record.js';
import {
  normalize, type RecommendationContext, type RecommendationStrategy, type StrategyScore,
} from '../recommendation-strategy.js';

/** Puntúa según matrículas reales del mercado: primero marca+modelo+color, luego marca+modelo. */
export class MarketPopularityStrategy implements RecommendationStrategy {
  readonly name = 'market-popularity';

  score(vehicle: VehicleDto, { marketUnits }: RecommendationContext): StrategyScore {
    const withColor = marketUnits.get(
      popularityKey(vehicle.brandName, vehicle.modelName, vehicle.colorName),
    );
    const units = withColor ?? marketUnits.get(popularityKey(vehicle.brandName, vehicle.modelName));
    if (!units) return { score: 0 };
    const label = withColor
      ? `${vehicle.modelName} ${vehicle.colorName.toLowerCase()}`
      : vehicle.modelName;
    return {
      score: normalize(units, marketUnits.values()),
      reason: `${label}: ${units.toLocaleString('es-CO')} unidades matriculadas en el mercado`,
    };
  }
}
