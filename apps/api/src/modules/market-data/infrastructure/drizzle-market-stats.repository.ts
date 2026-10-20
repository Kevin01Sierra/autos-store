import { Inject, Injectable } from '@nestjs/common';
import type { MarketInsightDto } from '@autos/contracts';
import { and, desc, ilike, sql, sum } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { marketStats } from '../../../shared/database/schema/index.js';
import type { MarketStatsRepository, TopModelsQuery } from '../application/market-data.ports.js';
import { popularityKey, type MarketRecord } from '../domain/market-record.js';

const units = sql<number>`${sum(marketStats.units)}::int`;

@Injectable()
export class DrizzleMarketStatsRepository implements MarketStatsRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async upsertMany(records: MarketRecord[]): Promise<number> {
    if (records.length === 0) return 0;
    await this.db
      .insert(marketStats)
      .values(records)
      .onConflictDoUpdate({
        target: [marketStats.brand, marketStats.model, marketStats.color,
          marketStats.period, marketStats.source],
        set: { units: sql`excluded.units` },
      });
    return records.length;
  }

  async topModels({ brand, color, limit }: TopModelsQuery): Promise<MarketInsightDto[]> {
    const where = and(
      brand ? ilike(marketStats.brand, brand) : undefined,
      color ? ilike(marketStats.color, color) : undefined,
    );
    const rows = await this.db
      .select({ brand: marketStats.brand, model: marketStats.model, color: marketStats.color,
        source: marketStats.source, period: sql<string>`max(${marketStats.period})`, units })
      .from(marketStats)
      .where(where)
      .groupBy(marketStats.brand, marketStats.model, marketStats.color, marketStats.source)
      .orderBy(desc(units))
      .limit(limit);
    return rows;
  }

  async unitsByKey(): Promise<Map<string, number>> {
    const rows = await this.db
      .select({ brand: marketStats.brand, model: marketStats.model, color: marketStats.color, units })
      .from(marketStats)
      .groupBy(marketStats.brand, marketStats.model, marketStats.color);
    const map = new Map<string, number>();
    for (const row of rows) {
      const modelKey = popularityKey(row.brand, row.model);
      map.set(popularityKey(row.brand, row.model, row.color), row.units);
      map.set(modelKey, (map.get(modelKey) ?? 0) + row.units);
    }
    return map;
  }
}
