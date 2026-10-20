import { z } from 'zod';
import type { VehicleDto } from './vehicle.schema.js';

export const preferencesSchema = z.object({
  brandIds: z.array(z.uuid()).max(5).default([]),
  modelIds: z.array(z.uuid()).max(5).default([]),
  colorIds: z.array(z.uuid()).max(5).default([]),
  maxBudget: z.number().positive().optional(),
});

export type PreferencesDto = z.infer<typeof preferencesSchema>;

export interface RecommendationDto {
  vehicle: VehicleDto;
  score: number;
  reasons: string[];
}

export interface MarketInsightDto {
  brand: string;
  model: string;
  color: string | null;
  units: number;
  period: string;
  source: string;
}
