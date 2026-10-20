import { Inject, Injectable } from '@nestjs/common';
import type { Paginated, UpdateVehicleDto, VehicleDto, VehicleFilter } from '@autos/contracts';
import { count, desc, eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { vehiclePrices, vehicles } from '../../../shared/database/schema/index.js';
import type { NewVehicle, VehicleRepository } from '../application/vehicle.repository.js';
import { VehicleConditionsBuilder } from './vehicle-conditions.builder.js';
import { selectVehicles, toVehicleDto } from './vehicle-read.query.js';

@Injectable()
export class DrizzleVehicleRepository implements VehicleRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async search(filter: VehicleFilter): Promise<Paginated<VehicleDto>> {
    const where = VehicleConditionsBuilder.from(filter);
    const { page, pageSize } = filter;
    const [rows, [total]] = await Promise.all([
      selectVehicles(this.db)
        .where(where)
        .orderBy(desc(vehicles.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db.select({ value: count() }).from(selectVehicles(this.db).where(where).as('f')),
    ]);
    return { items: rows.map(toVehicleDto), total: total?.value ?? 0, page, pageSize };
  }

  async findById(id: string): Promise<VehicleDto | null> {
    const [row] = await selectVehicles(this.db).where(eq(vehicles.id, id));
    return row ? toVehicleDto(row) : null;
  }

  async findAvailable(limit: number): Promise<VehicleDto[]> {
    return (await this.search({ onlyAvailable: true, page: 1, pageSize: limit })).items;
  }

  /** Inserta el vehículo y su precio inicial en una misma transacción. */
  async create({ price, ...data }: NewVehicle): Promise<VehicleDto> {
    const id = await this.db.transaction(async (tx) => {
      const [vehicle] = await tx.insert(vehicles).values(data).returning({ id: vehicles.id });
      await tx.insert(vehiclePrices).values({ vehicleId: vehicle!.id, amount: price });
      return vehicle!.id;
    });
    return (await this.findById(id))!;
  }

  async update(id: string, data: UpdateVehicleDto): Promise<VehicleDto | null> {
    const rows = await this.db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning();
    return rows.length ? this.findById(id) : null;
  }

  /** Borrado lógico: un vehículo con ventas no se elimina, se archiva. */
  async remove(id: string): Promise<boolean> {
    const archived = { status: 'archived' };
    const rows = await this.db.update(vehicles).set(archived).where(eq(vehicles.id, id)).returning();
    return rows.length > 0;
  }
}
