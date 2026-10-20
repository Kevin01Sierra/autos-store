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

/** Normaliza un valor frente al máximo de su mapa (0 si no hay datos). */
export const normalize = (value: number, values: Iterable<number>): number => {
  const max = Math.max(0, ...values);
  return max === 0 ? 0 : value / max;
};
