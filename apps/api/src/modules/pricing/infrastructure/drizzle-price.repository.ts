import { Inject, Injectable } from '@nestjs/common';
import type { PriceDto } from '@autos/contracts';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { vehiclePrices } from '../../../shared/database/schema/index.js';
import type { PriceRepository } from '../application/price.repository.js';

type PriceRow = typeof vehiclePrices.$inferSelect;

const toDto = (row: PriceRow): PriceDto => ({
  id: row.id,
  vehicleId: row.vehicleId,
  amount: row.amount,
  currency: 'COP',
  validFrom: row.validFrom.toISOString(),
  validTo: row.validTo?.toISOString() ?? null,
});

@Injectable()
export class DrizzlePriceRepository implements PriceRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async history(vehicleId: string): Promise<PriceDto[]> {
    const rows = await this.db
      .select()
      .from(vehiclePrices)
      .where(eq(vehiclePrices.vehicleId, vehicleId))
      .orderBy(desc(vehiclePrices.validFrom));
    return rows.map(toDto);
  }

  async replaceCurrent(vehicleId: string, amount: number): Promise<PriceDto> {
    return this.db.transaction(async (tx) => {
      const isCurrent = and(eq(vehiclePrices.vehicleId, vehicleId), isNull(vehiclePrices.validTo));
      await tx.update(vehiclePrices).set({ validTo: new Date() }).where(isCurrent);
      const [row] = await tx.insert(vehiclePrices).values({ vehicleId, amount }).returning();
      return toDto(row!);
    });
  }

  async removeHistorical(priceId: string): Promise<boolean> {
    const rows = await this.db
      .delete(vehiclePrices)
      .where(and(eq(vehiclePrices.id, priceId), isNotNull(vehiclePrices.validTo)))
      .returning();
    return rows.length > 0;
  }
}
