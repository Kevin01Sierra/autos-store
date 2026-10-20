import type { VehicleDto } from '@autos/contracts';
import type {
  RecommendationContext, RecommendationStrategy, StrategyScore,
} from '../recommendation-strategy.js';

/** Puntúa la coincidencia con lo que el usuario eligió al inicio (marca, modelo, color, presupuesto). */
export class PreferenceMatchStrategy implements RecommendationStrategy {
  readonly name = 'preference-match';

  score(vehicle: VehicleDto, { preferences: p }: RecommendationContext): StrategyScore {
    const checks: [boolean, boolean, string][] = [
      [p.brandIds.length > 0, p.brandIds.includes(vehicle.brandId), 'marca'],
      [p.modelIds.length > 0, p.modelIds.includes(vehicle.modelId), 'modelo'],
      [p.colorIds.length > 0, p.colorIds.includes(vehicle.colorId), 'color'],
      [p.maxBudget !== undefined, vehicle.price <= (p.maxBudget ?? 0), 'presupuesto'],
    ];
    const active = checks.filter(([requested]) => requested);
    if (active.length === 0) return { score: 0 };
    const matched = active.filter(([, ok]) => ok).map(([, , label]) => label);
    return {
      score: matched.length / active.length,
      reason: matched.length ? `Coincide con tu ${matched.join(', ')}` : undefined,
    };
  }
}
