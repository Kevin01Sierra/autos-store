import type { VehicleDto } from '@autos/contracts';
import { modelUnits, popularityKey } from '../../../market-data/domain/market-record.js';
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
    const units = withColor ?? modelUnits(marketUnits, vehicle.brandName, vehicle.modelName);
    if (!units) return { score: 0 };
    const label = withColor
      ? `${vehicle.modelName} ${vehicle.colorName.toLowerCase()}`
      : vehicle.modelName;
    return {
      // Al sumar versiones el total puede superar al máximo individual: se acota a 1.
      score: Math.min(1, normalize(units, marketUnits.values())),
      reason: `${label}: ${units.toLocaleString('es-CO')} unidades registradas en el mercado`,
    };
  }
}
