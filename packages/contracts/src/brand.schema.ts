import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().trim().min(2).max(60),
  country: z.string().trim().min(2).max(60),
  logoUrl: z.url().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandDto = z.infer<typeof createBrandSchema>;
export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;

export interface BrandDto extends CreateBrandDto {
  id: string;
  slug: string;
}
