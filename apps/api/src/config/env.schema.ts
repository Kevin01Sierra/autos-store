import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.url(),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  CRON_SECRET: z.string().min(8),
  MARKET_DATASET_URL: z.url().optional(),
  MARKET_FIELD_BRAND: z.string().default('marca'),
  MARKET_FIELD_MODEL: z.string().default('linea'),
  MARKET_FIELD_COLOR: z.string().optional(),
  MARKET_FIELD_PERIOD: z.string().default('modelo'),
  MARKET_PERIOD_TYPE: z.enum(['year', 'date']).default('year'),
  MARKET_WHERE: z.string().optional(),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (raw: Record<string, unknown>): Env => envSchema.parse(raw);
