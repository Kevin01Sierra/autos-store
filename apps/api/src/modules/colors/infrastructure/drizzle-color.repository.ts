import { Inject, Injectable } from '@nestjs/common';
import type { ColorDto, CreateColorDto, UpdateColorDto } from '@autos/contracts';
import { DATABASE, type Database } from '../../../shared/database/database.tokens.js';
import { DrizzleCrudRepository } from '../../../shared/database/drizzle-crud.repository.js';
import { colors } from '../../../shared/database/schema/index.js';
import type { ColorRepository } from '../application/color.repository.js';

@Injectable()
export class DrizzleColorRepository
  extends DrizzleCrudRepository<typeof colors, ColorDto, CreateColorDto, UpdateColorDto>
  implements ColorRepository
{
  constructor(@Inject(DATABASE) db: Database) {
    super(db, colors);
  }

  protected toEntity(row: typeof colors.$inferSelect): ColorDto {
    return row;
  }
}
