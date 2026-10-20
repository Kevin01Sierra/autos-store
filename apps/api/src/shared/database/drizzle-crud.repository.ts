import { eq } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { CrudRepository } from '../application/crud.repository.js';
import type { Database } from './database.tokens.js';

type TableWithId = PgTable & { id: PgColumn };

/**
 * Adaptador genérico de Repository sobre Drizzle. Cada repositorio concreto
 * solo indica su tabla y cómo mapear una fila a la entidad.
 */
export abstract class DrizzleCrudRepository<TTable extends TableWithId, TEntity, TCreate, TUpdate>
  implements CrudRepository<TEntity, TCreate, TUpdate>
{
  protected constructor(
    protected readonly db: Database,
    protected readonly table: TTable,
  ) {}

  protected abstract toEntity(row: TTable['$inferSelect']): TEntity;

  async findAll(): Promise<TEntity[]> {
    const rows = await this.db.select().from(this.table as PgTable);
    return rows.map((row) => this.toEntity(row as TTable['$inferSelect']));
  }

  async findById(id: string): Promise<TEntity | null> {
    const [row] = await this.db
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.id, id));
    return row ? this.toEntity(row as TTable['$inferSelect']) : null;
  }

  async create(data: TCreate): Promise<TEntity> {
    const [row] = await this.db
      .insert(this.table)
      .values(data as TTable['$inferInsert'])
      .returning();
    return this.toEntity(row as TTable['$inferSelect']);
  }

  async update(id: string, data: TUpdate): Promise<TEntity | null> {
    const [row] = await this.db
      .update(this.table)
      .set(data as Partial<TTable['$inferInsert']>)
      .where(eq(this.table.id, id))
      .returning();
    return row ? this.toEntity(row as TTable['$inferSelect']) : null;
  }

  async remove(id: string): Promise<boolean> {
    const rows = await this.db.delete(this.table).where(eq(this.table.id, id)).returning();
    return rows.length > 0;
  }
}
