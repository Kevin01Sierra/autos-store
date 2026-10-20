import { Inject, Injectable } from '@nestjs/common';
import type { PreferencesDto } from '@autos/contracts';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { userPreferences } from '../../../shared/database/schema/index.js';
import type { PreferencesRepository } from '../application/recommendation.ports.js';

type Row = typeof userPreferences.$inferSelect;

const toDto = (row: Row): PreferencesDto => ({
  brandIds: row.brandIds,
  modelIds: row.modelIds,
  colorIds: row.colorIds,
  maxBudget: row.maxBudget ?? undefined,
});

@Injectable()
export class DrizzlePreferencesRepository implements PreferencesRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async find(userId: string): Promise<PreferencesDto | null> {
    const [row] = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return row ? toDto(row) : null;
  }

  async save(userId: string, preferences: PreferencesDto): Promise<PreferencesDto> {
    const values = { ...preferences, maxBudget: preferences.maxBudget ?? null, userId };
    const [row] = await this.db
      .insert(userPreferences)
      .values(values)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { ...values, updatedAt: new Date() },
      })
      .returning();
    return toDto(row!);
  }
}
