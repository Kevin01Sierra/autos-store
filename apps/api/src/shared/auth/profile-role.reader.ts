import { Inject, Injectable } from '@nestjs/common';
import type { Role } from '@autos/contracts';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.tokens.js';
import { profiles } from '../database/schema/index.js';
import type { RoleReader } from './auth-user.js';

@Injectable()
export class ProfileRoleReader implements RoleReader {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async roleOf(userId: string): Promise<Role> {
    const [row] = await this.db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.id, userId));
    return row?.role === 'admin' ? 'admin' : 'customer';
  }
}
