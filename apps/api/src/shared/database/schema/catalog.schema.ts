import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  country: text('country').notNull(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const models = pgTable('models', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  bodyType: text('body_type').notNull(),
  fuelType: text('fuel_type').notNull(),
});

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  hex: text('hex').notNull(),
});
