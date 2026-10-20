import { Inject, Injectable } from '@nestjs/common';
import type { AdminMetricsDto } from '@autos/contracts';
import { and, asc, desc, eq, lte, ne, sql } from 'drizzle-orm';
import { DATABASE, type Database } from '../../shared/database/database.tokens.js';
import {
  brands, models, orderItems, orders, vehicles,
} from '../../shared/database/schema/index.js';

const int = (expr: ReturnType<typeof sql>) => sql<number>`coalesce(${expr}, 0)::int`;
const label = sql<string>`${brands.name} || ' ' || ${models.name}`;
const LOW_STOCK = 2;

/** Consulta de lectura (CQRS ligero): métricas del panel de administración. */
@Injectable()
export class AdminMetricsQuery {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async execute(): Promise<AdminMetricsDto> {
    const [inventory, sales, lowStock, topSold] = await Promise.all([
      this.db.select({
        published: int(sql`count(*) filter (where ${vehicles.status} = 'published')`),
        draft: int(sql`count(*) filter (where ${vehicles.status} = 'draft')`),
        units: int(sql`sum(${vehicles.stock}) filter (where ${vehicles.status} = 'published')`),
      }).from(vehicles),
      this.db.select({ count: int(sql`count(*)`), revenue: int(sql`sum(${orders.total})`) })
        .from(orders).where(ne(orders.status, 'cancelled')),
      this.withNames().where(and(eq(vehicles.status, 'published'), lte(vehicles.stock, LOW_STOCK)))
        .orderBy(asc(vehicles.stock)).limit(10),
      this.db.select({ label, units: int(sql`sum(${orderItems.quantity})`) })
        .from(orderItems)
        .innerJoin(vehicles, eq(vehicles.id, orderItems.vehicleId))
        .innerJoin(models, eq(models.id, vehicles.modelId))
        .innerJoin(brands, eq(brands.id, models.brandId))
        .groupBy(brands.name, models.name).orderBy(desc(sql`2`)).limit(5),
    ]);
    const [inv = { published: 0, draft: 0, units: 0 }] = inventory;
    const [sale = { count: 0, revenue: 0 }] = sales;
    return {
      publishedVehicles: inv.published, pendingApproval: inv.draft, unitsInStock: inv.units,
      orders: sale.count, revenue: sale.revenue, lowStock, topSold,
    };
  }

  private withNames() {
    return this.db
      .select({ vehicleId: vehicles.id, label, stock: vehicles.stock })
      .from(vehicles)
      .innerJoin(models, eq(models.id, vehicles.modelId))
      .innerJoin(brands, eq(brands.id, models.brandId))
      .$dynamic();
  }
}
