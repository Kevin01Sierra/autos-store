import { Inject, Injectable } from '@nestjs/common';
import type { OrderDto } from '@autos/contracts';
import { and, eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { orderItems, orders } from '../../../shared/database/schema/index.js';
import { ConflictError } from '../../../shared/domain/domain-errors.js';
import type {
  NewOrderLine, OrderRepository, StatusChange,
} from '../application/order.repository.js';
import { byCustomer, byId, loadOrders } from './order.mapper.js';
import { moveStock } from './stock-movement.js';

@Injectable()
export class DrizzleOrderRepository implements OrderRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Unit of Work: descuenta stock de forma atómica (sin sobreventa) y crea el pedido. */
  async place(customerId: string, lines: NewOrderLine[]): Promise<OrderDto> {
    const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const id = await this.db.transaction(async (tx) => {
      for (const line of lines) await moveStock(tx, line.vehicleId, -line.quantity);
      const [order] = await tx.insert(orders).values({ customerId, total }).returning();
      await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order!.id })));
      return order!.id;
    });
    return (await this.findById(id))!;
  }

  async findById(id: string): Promise<OrderDto | null> {
    const [order] = await loadOrders(this.db, byId(id));
    return order ?? null;
  }

  findByCustomer(customerId: string): Promise<OrderDto[]> {
    return loadOrders(this.db, byCustomer(customerId));
  }

  findAll(): Promise<OrderDto[]> {
    return loadOrders(this.db);
  }

  /** El UPDATE solo aplica si el estado no cambió desde que se leyó (sin carreras). */
  async changeStatus(id: string, { from, to, releaseStock }: StatusChange): Promise<OrderDto> {
    await this.db.transaction(async (tx) => {
      const rows = await tx.update(orders).set({ status: to })
        .where(and(byId(id), eq(orders.status, from))).returning({ id: orders.id });
      if (rows.length === 0) throw new ConflictError('El pedido cambió mientras lo editabas, recarga');
      if (!releaseStock) return;
      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
      for (const item of items) await moveStock(tx, item.vehicleId, item.quantity);
    });
    return (await this.findById(id))!;
  }
}
