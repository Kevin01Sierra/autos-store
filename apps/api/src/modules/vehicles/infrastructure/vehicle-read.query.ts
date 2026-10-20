import type { VehicleDto } from '@autos/contracts';
import { and, eq, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { Database } from '../../../shared/database/database.tokens.js';
import {
  brands, colors, models, vehiclePrices, vehicles,
} from '../../../shared/database/schema/index.js';

/** Precio vigente: el registro del historial sin fecha de fin. */
export const currentPrice = alias(vehiclePrices, 'current_price');

const columns = {
  vehicle: vehicles,
  price: currentPrice.amount,
  brandId: brands.id,
  brandName: brands.name,
  modelName: models.name,
  bodyType: models.bodyType,
  fuelType: models.fuelType,
  colorName: colors.name,
  colorHex: colors.hex,
};

type VehicleRow = {
  vehicle: typeof vehicles.$inferSelect;
  price: number | null;
} & Omit<VehicleDto, keyof typeof vehicles.$inferSelect | 'price'>;

/** Consulta base de lectura: vehículo + marca + modelo + color + precio vigente. */
export const selectVehicles = (db: Database) =>
  db
    .select(columns)
    .from(vehicles)
    .innerJoin(models, eq(models.id, vehicles.modelId))
    .innerJoin(brands, eq(brands.id, models.brandId))
    .innerJoin(colors, eq(colors.id, vehicles.colorId))
    .leftJoin(
      currentPrice,
      and(eq(currentPrice.vehicleId, vehicles.id), isNull(currentPrice.validTo)),
    )
    .$dynamic();

export const toVehicleDto = ({ vehicle, price, ...names }: VehicleRow): VehicleDto => ({
  id: vehicle.id,
  modelId: vehicle.modelId,
  colorId: vehicle.colorId,
  year: vehicle.year,
  mileageKm: vehicle.mileageKm,
  transmission: vehicle.transmission as VehicleDto['transmission'],
  stock: vehicle.stock,
  status: vehicle.status as VehicleDto['status'],
  imageUrls: vehicle.imageUrls,
  sellerId: vehicle.sellerId,
  price: price ?? 0,
  ...names,
});
