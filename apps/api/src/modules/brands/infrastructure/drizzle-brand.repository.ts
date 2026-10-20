import { Inject, Injectable } from '@nestjs/common';
import type { BrandDto } from '@autos/contracts';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { DrizzleCrudRepository } from '../../../shared/database/drizzle-crud.repository.js';
import { brands } from '../../../shared/database/schema/index.js';
import type { BrandChanges, BrandRepository, NewBrand } from '../application/brand.repository.js';

@Injectable()
export class DrizzleBrandRepository
  extends DrizzleCrudRepository<typeof brands, BrandDto, NewBrand, BrandChanges>
  implements BrandRepository
{
  constructor(@Inject(DATABASE) db: Database) {
    super(db, brands);
  }

  protected toEntity(row: typeof brands.$inferSelect): BrandDto {
    const { id, name, slug, country, logoUrl } = row;
    return { id, name, slug, country, logoUrl: logoUrl ?? undefined };
  }
}
