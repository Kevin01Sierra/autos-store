import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { salesStats } from '../../../shared/database/schema/index.js';
import type { SalesStatsReader } from '../application/recommendation.ports.js';
import { salesKey } from '../domain/strategies/store-sales.strategy.js';

@Injectable()
export class DrizzleSalesStatsReader implements SalesStatsReader {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async unitsByModelColor(): Promise<Map<string, number>> {
    const rows = await this.db.select().from(salesStats);
    return new Map(rows.map((r) => [salesKey(r.modelId, r.colorId), r.units]));
  }

  async refresh(): Promise<void> {
    await this.db.execute(sql`refresh materialized view concurrently public.sales_stats`);
  }
}
