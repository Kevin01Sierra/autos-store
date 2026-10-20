import type { MarketInsightDto } from '@autos/contracts';
import type { MarketRecord } from '../domain/market-record.js';

/** Puerto (Target del patrón Adapter): cualquier fuente externa de ventas/matrículas. */
export interface MarketDataSource {
  readonly name: string;
  fetchRecords(): Promise<MarketRecord[]>;
}

export interface TopModelsQuery {
  brand?: string;
  color?: string;
  limit: number;
}

export interface MarketStatsRepository {
  upsertMany(records: MarketRecord[]): Promise<number>;
  topModels(query: TopModelsQuery): Promise<MarketInsightDto[]>;
  /** Unidades por clave marca|modelo|color y marca|modelo| (sin color). */
  unitsByKey(): Promise<Map<string, number>>;
}

export const MARKET_DATA_SOURCE = Symbol('MARKET_DATA_SOURCE');
export const MARKET_STATS_REPOSITORY = Symbol('MARKET_STATS_REPOSITORY');
