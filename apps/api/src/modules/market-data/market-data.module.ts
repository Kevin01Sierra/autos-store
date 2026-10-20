import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MARKET_DATA_SOURCE, MARKET_STATS_REPOSITORY } from './application/market-data.ports.js';
import { MarketDataService } from './application/market-data.service.js';
import { DrizzleMarketStatsRepository } from './infrastructure/drizzle-market-stats.repository.js';
import { ResilientMarketSource } from './infrastructure/resilient-market.source.js';
import { SocrataMarketSource } from './infrastructure/socrata-market.source.js';
import { MarketController } from './presentation/market.controller.js';

@Module({
  controllers: [MarketController],
  providers: [
    MarketDataService,
    { provide: MARKET_STATS_REPOSITORY, useClass: DrizzleMarketStatsRepository },
    {
      provide: MARKET_DATA_SOURCE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new ResilientMarketSource(new SocrataMarketSource(config)),
    },
  ],
  exports: [MarketDataService],
})
export class MarketDataModule {}
