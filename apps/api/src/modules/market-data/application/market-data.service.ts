import { Inject, Injectable, Logger } from '@nestjs/common';
import type { MarketInsightDto } from '@autos/contracts';
import {
  MARKET_DATA_SOURCE, MARKET_STATS_REPOSITORY,
  type MarketDataSource, type MarketStatsRepository, type TopModelsQuery,
} from './market-data.ports.js';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(
    @Inject(MARKET_DATA_SOURCE) private readonly source: MarketDataSource,
    @Inject(MARKET_STATS_REPOSITORY) private readonly stats: MarketStatsRepository,
  ) {}

  /** Trae los datos de la fuente externa y los guarda; se ejecuta desde un cron. */
  async sync(): Promise<{ source: string; records: number }> {
    const records = await this.source.fetchRecords();
    const saved = await this.stats.upsertMany(records);
    this.logger.log(`Sincronizados ${saved} registros desde ${this.source.name}`);
    return { source: this.source.name, records: saved };
  }

  topModels(query: TopModelsQuery): Promise<MarketInsightDto[]> {
    return this.stats.topModels(query);
  }

  unitsByKey(): Promise<Map<string, number>> {
    return this.stats.unitsByKey();
  }
}
