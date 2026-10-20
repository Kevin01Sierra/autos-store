import { and, eq, gte, sql } from 'drizzle-orm';
import type { Database } from '../../../shared/database/database.tokens.js';
import { BusinessRuleError } from '../../../shared/domain/domain-errors.js';
import { vehicles } from '../../../shared/database/schema/index.js';

export type Tx = Parameters<Parameters<Database['transaction']>[0]>[0];

/**
 * Mueve stock con un UPDATE condicional: si otro cliente compró antes y ya no
 * alcanza, no se actualiza ninguna fila y la transacción completa se revierte.
 */
export async function moveStock(tx: Tx, vehicleId: string, delta: number): Promise<void> {
  const enough = gte(vehicles.stock, Math.max(0, -delta));
  const rows = await tx
    .update(vehicles)
    .set({ stock: sql`${vehicles.stock} + ${delta}` })
    .where(and(eq(vehicles.id, vehicleId), enough))
    .returning({ id: vehicles.id });
  if (rows.length === 0) throw new BusinessRuleError('Stock insuficiente, intenta de nuevo');
}
