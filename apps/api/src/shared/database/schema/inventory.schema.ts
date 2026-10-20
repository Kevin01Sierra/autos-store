import { integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { colors, models } from './catalog.schema.js';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  role: text('role').notNull().default('customer'),
});

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  modelId: uuid('model_id')
    .notNull()
    .references(() => models.id),
  colorId: uuid('color_id')
    .notNull()
    .references(() => colors.id),
  sellerId: uuid('seller_id'),
  year: integer('year').notNull(),
  mileageKm: integer('mileage_km').notNull().default(0),
  transmission: text('transmission').notNull(),
  stock: integer('stock').notNull(),
  status: text('status').notNull().default('published'),
  imageUrls: text('image_urls').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const vehiclePrices = pgTable('vehicle_prices', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id),
  amount: numeric('amount', { precision: 14, scale: 2, mode: 'number' }).notNull(),
  currency: text('currency').notNull().default('COP'),
  validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow().notNull(),
  validTo: timestamp('valid_to', { withTimezone: true }),
});
