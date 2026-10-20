import type { PreferencesDto, VehicleDto } from '@autos/contracts';

/** Datos que comparten todas las estrategias para puntuar un vehículo. */
export interface RecommendationContext {
  preferences: PreferencesDto;
  marketUnits: Map<string, number>;
  salesUnits: Map<string, number>;
}

/** Resultado de una estrategia: puntaje normalizado 0..1 y motivo legible. */
export interface StrategyScore {
  score: number;
  reason?: string;
}

/** Patrón Strategy: cada algoritmo de recomendación es intercambiable. */
export interface RecommendationStrategy {
  readonly name: string;
  score(vehicle: VehicleDto, context: RecommendationContext): StrategyScore;
}

// Los mapas se arman una vez por petición: el máximo se calcula una vez, no por cada vehículo.
const maxByMap = new WeakMap<Map<string, number>, number>();

/** Normaliza un valor frente al máximo de su mapa (0 si no hay datos). */
export const normalize = (value: number, units: Map<string, number>): number => {
  let max = maxByMap.get(units);
  if (max === undefined) {
    max = 0;
    for (const n of units.values()) max = Math.max(max, n);
    maxByMap.set(units, max);
  }
  return max === 0 ? 0 : value / max;
};
