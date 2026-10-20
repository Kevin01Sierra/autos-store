import type { VehicleDto } from '@autos/contracts';
import {
  normalize, type RecommendationContext, type RecommendationStrategy, type StrategyScore,
} from '../recommendation-strategy.js';

export const salesKey = (modelId: string, colorId: string): string => `${modelId}|${colorId}`;

/** Puntúa según lo que más compran los clientes de esta tienda. */
export class StoreSalesStrategy implements RecommendationStrategy {
  readonly name = 'store-sales';

  score(vehicle: VehicleDto, { salesUnits }: RecommendationContext): StrategyScore {
    const units = salesUnits.get(salesKey(vehicle.modelId, vehicle.colorId)) ?? 0;
    if (units === 0) return { score: 0 };
    return {
      score: normalize(units, salesUnits),
      reason: `${units} ${units === 1 ? 'compra' : 'compras'} en nuestra tienda`,
    };
  }
}
