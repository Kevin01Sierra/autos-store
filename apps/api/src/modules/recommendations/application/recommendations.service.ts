import { Inject, Injectable } from '@nestjs/common';
import type { PreferencesDto, RecommendationDto } from '@autos/contracts';
import { MarketDataService } from '../../market-data/application/market-data.service.js';
import {
  VEHICLE_REPOSITORY, type VehicleRepository,
} from '../../vehicles/application/vehicle.repository.js';
import type { RecommendationContext } from '../domain/recommendation-strategy.js';
import { createRecommendationStrategy } from './recommendation-strategy.factory.js';
import {
  EMPTY_PREFERENCES, PREFERENCES_REPOSITORY, SALES_STATS_READER,
  type PreferencesRepository, type SalesStatsReader,
} from './recommendation.ports.js';

const CANDIDATE_POOL = 100;

@Injectable()
export class RecommendationsService {
  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly vehicles: VehicleRepository,
    @Inject(SALES_STATS_READER) private readonly sales: SalesStatsReader,
    @Inject(PREFERENCES_REPOSITORY) private readonly preferences: PreferencesRepository,
    private readonly market: MarketDataService,
  ) {}

  async forUser(userId: string, limit: number): Promise<RecommendationDto[]> {
    const saved = await this.preferences.find(userId);
    return this.recommend(saved ?? EMPTY_PREFERENCES, limit);
  }

  /** Puntúa los vehículos disponibles y devuelve los mejores con sus motivos. */
  async recommend(preferences: PreferencesDto, limit: number): Promise<RecommendationDto[]> {
    const [candidates, marketUnits, salesUnits] = await Promise.all([
      this.vehicles.findAvailable(CANDIDATE_POOL),
      this.market.unitsByKey(),
      this.sales.unitsByModelColor(),
    ]);
    const context: RecommendationContext = { preferences, marketUnits, salesUnits };
    const strategy = createRecommendationStrategy(preferences);
    return candidates
      .map((vehicle) => ({ vehicle, ...strategy.score(vehicle, context) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
