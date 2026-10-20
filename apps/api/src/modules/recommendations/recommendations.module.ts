import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module.js';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { PreferencesService } from './application/preferences.service.js';
import { PREFERENCES_REPOSITORY, SALES_STATS_READER } from './application/recommendation.ports.js';
import { RecommendationsService } from './application/recommendations.service.js';
import { SalesStatsListener } from './application/sales-stats.listener.js';
import { DrizzlePreferencesRepository } from './infrastructure/drizzle-preferences.repository.js';
import { DrizzleSalesStatsReader } from './infrastructure/drizzle-sales-stats.reader.js';
import { RecommendationsController } from './presentation/recommendations.controller.js';

@Module({
  imports: [VehiclesModule, MarketDataModule],
  controllers: [RecommendationsController],
  providers: [
    RecommendationsService,
    PreferencesService,
    SalesStatsListener,
    { provide: SALES_STATS_READER, useClass: DrizzleSalesStatsReader },
    { provide: PREFERENCES_REPOSITORY, useClass: DrizzlePreferencesRepository },
  ],
})
export class RecommendationsModule {}
