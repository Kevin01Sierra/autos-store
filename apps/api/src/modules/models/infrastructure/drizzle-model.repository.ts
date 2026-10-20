import { Inject, Injectable } from '@nestjs/common';
import type { ModelDto } from '@autos/contracts';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { DrizzleCrudRepository } from '../../../shared/database/drizzle-crud.repository.js';
import { brands, models } from '../../../shared/database/schema/index.js';
import type { ModelChanges, ModelRepository, NewModel } from '../application/model.repository.js';

type ModelRow = typeof models.$inferSelect;

@Injectable()
export class DrizzleModelRepository
  extends DrizzleCrudRepository<typeof models, ModelDto, NewModel, ModelChanges>
  implements ModelRepository
{
  constructor(@Inject(DATABASE) db: Database) {
    super(db, models);
  }

  override findAll(): Promise<ModelDto[]> {
    return this.selectWithBrand();
  }

  findByBrand(brandId: string): Promise<ModelDto[]> {
    return this.selectWithBrand(brandId);
  }

  protected toEntity(row: ModelRow, brandName?: string): ModelDto {
    return { ...row, brandName } as ModelDto;
  }

  private async selectWithBrand(brandId?: string): Promise<ModelDto[]> {
    const rows = await this.db
      .select({ model: models, brandName: brands.name })
      .from(models)
      .innerJoin(brands, eq(brands.id, models.brandId))
      .where(brandId ? eq(models.brandId, brandId) : undefined)
      .orderBy(brands.name, models.name);
    return rows.map((r) => this.toEntity(r.model, r.brandName));
  }
}
