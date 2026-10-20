import {
  bigint, date, integer, numeric, pgMaterializedView, pgTable, text, timestamp, uuid,
} from 'drizzle-orm/pg-core';

export const marketStats = pgTable('market_stats', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  color: text('color'),
  period: date('period').notNull(),
  units: integer('units').notNull(),
  source: text('source').notNull(),
});

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').primaryKey(),
  brandIds: uuid('brand_ids').array().notNull().default([]),
  modelIds: uuid('model_ids').array().notNull().default([]),
  colorIds: uuid('color_ids').array().notNull().default([]),
  maxBudget: numeric('max_budget', { precision: 14, scale: 2, mode: 'number' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const salesStats = pgMaterializedView('sales_stats', {
  modelId: uuid('model_id').notNull(),
  colorId: uuid('color_id').notNull(),
  units: integer('units').notNull(),
}).existing();
