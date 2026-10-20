import type { VehicleDto } from '@autos/contracts';
import type {
  RecommendationContext, RecommendationStrategy, StrategyScore,
} from '../recommendation-strategy.js';

export interface WeightedStrategy {
  strategy: RecommendationStrategy;
  weight: number;
}

/**
 * Composite: combina varias estrategias en un puntaje ponderado y se comporta,
 * hacia afuera, como una estrategia más.
 */
export class WeightedCompositeStrategy implements RecommendationStrategy {
  readonly name = 'weighted-composite';

  constructor(private readonly parts: WeightedStrategy[]) {}

  score(vehicle: VehicleDto, context: RecommendationContext): StrategyScore & { reasons: string[] } {
    const totalWeight = this.parts.reduce((sum, p) => sum + p.weight, 0) || 1;
    const results = this.parts.map((p) => ({ ...p.strategy.score(vehicle, context), w: p.weight }));
    const score = results.reduce((sum, r) => sum + r.score * r.w, 0) / totalWeight;
    const reasons = results.flatMap((r) => (r.reason ? [r.reason] : []));
    return { score: Math.round(score * 1000) / 1000, reasons };
  }
}
