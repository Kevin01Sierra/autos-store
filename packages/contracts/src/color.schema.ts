import { z } from 'zod';

export const createColorSchema = z.object({
  name: z.string().trim().min(2).max(40),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato #RRGGBB'),
});

export const updateColorSchema = createColorSchema.partial();

export type CreateColorDto = z.infer<typeof createColorSchema>;
export type UpdateColorDto = z.infer<typeof updateColorSchema>;

export interface ColorDto extends CreateColorDto {
  id: string;
}
