import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from './schema/index.js';

export const DATABASE = Symbol('DATABASE');
export type Database = PostgresJsDatabase<typeof schema>;
