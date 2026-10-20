import { z } from 'zod';

export const BODY_TYPES = ['sedan', 'hatchback', 'suv', 'pickup', 'van', 'coupe'] as const;
export const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric'] as const;

export const createModelSchema = z.object({
  brandId: z.uuid(),
  name: z.string().trim().min(1).max(60),
  bodyType: z.enum(BODY_TYPES),
  fuelType: z.enum(FUEL_TYPES),
});

export const updateModelSchema = createModelSchema.partial();

export type CreateModelDto = z.infer<typeof createModelSchema>;
export type UpdateModelDto = z.infer<typeof updateModelSchema>;

export interface ModelDto extends CreateModelDto {
  id: string;
  slug: string;
  brandName?: string;
}
