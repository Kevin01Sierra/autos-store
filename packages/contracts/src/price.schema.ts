import { z } from 'zod';

export const setPriceSchema = z.object({
  amount: z.number().positive(),
  currency: z.literal('COP').default('COP'),
});

export type SetPriceDto = z.infer<typeof setPriceSchema>;

export interface PriceDto {
  id: string;
  vehicleId: string;
  amount: number;
  currency: 'COP';
  validFrom: string;
  validTo: string | null;
}
