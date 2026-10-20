import { z } from 'zod';
import { paginationSchema } from './common.schema.js';

export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export const VEHICLE_STATUSES = ['draft', 'published', 'archived'] as const;
const currentYear = new Date().getFullYear();

export const createVehicleSchema = z.object({
  modelId: z.uuid(),
  colorId: z.uuid(),
  year: z.number().int().min(1990).max(currentYear + 1),
  mileageKm: z.number().int().min(0).default(0),
  transmission: z.enum(TRANSMISSIONS),
  stock: z.number().int().min(0),
  price: z.number().positive(),
  imageUrls: z.array(z.url()).max(8).default([]),
  status: z.enum(VEHICLE_STATUSES).default('published'),
});

export const updateVehicleSchema = createVehicleSchema.omit({ price: true }).partial();

export const vehicleFilterSchema = paginationSchema.extend({
  brandId: z.uuid().optional(),
  modelId: z.uuid().optional(),
  colorId: z.uuid().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minYear: z.coerce.number().int().optional(),
  search: z.string().trim().max(60).optional(),
  onlyAvailable: z.stringbool().default(true),
  status: z.enum(VEHICLE_STATUSES).optional(),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;

export interface VehicleDto extends Omit<CreateVehicleDto, 'price'> {
  id: string;
  price: number;
  sellerId: string | null;
  brandId: string;
  brandName: string;
  modelName: string;
  bodyType: string;
  fuelType: string;
  colorName: string;
  colorHex: string;
}
