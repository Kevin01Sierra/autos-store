import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { sql } from 'drizzle-orm';
import { DATABASE, type Database } from '../../shared/database/database.tokens.js';

@ApiTags('Salud')
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Usado por el monitoreo y por el cron que evita que Supabase pause el proyecto. */
  @Get()
  async check() {
    await this.db.execute(sql`select 1`);
    return { status: 'ok', time: new Date().toISOString() };
  }
}
