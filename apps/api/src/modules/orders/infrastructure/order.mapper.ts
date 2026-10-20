import type { OrderDto, OrderStatus } from '@autos/contracts';
import { asc, desc, eq, inArray, type SQL } from 'drizzle-orm';
import type { Database } from '../../../shared/database/database.tokens.js';
import { orderItems, orders } from '../../../shared/database/schema/index.js';

type OrderRow = typeof orders.$inferSelect;
type ItemRow = typeof orderItems.$inferSelect;

const toDto = (order: OrderRow, items: ItemRow[]): OrderDto => ({
  id: order.id,
  customerId: order.customerId,
  status: order.status as OrderStatus,
  total: order.total,
  createdAt: order.createdAt.toISOString(),
  items: items
    .filter((item) => item.orderId === order.id)
    .map(({ vehicleId, quantity, unitPrice }) => ({ vehicleId, quantity, unitPrice })),
});

/** Carga pedidos con sus ítems en dos consultas (evita el problema N+1). */
export async function loadOrders(db: Database, where?: SQL): Promise<OrderDto[]> {
  const rows = await db.select().from(orders).where(where).orderBy(desc(orders.createdAt));
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, ids))
    .orderBy(asc(orderItems.id));
  return rows.map((row) => toDto(row, items));
}

export const byId = (id: string) => eq(orders.id, id);
export const byCustomer = (customerId: string) => eq(orders.customerId, customerId);
