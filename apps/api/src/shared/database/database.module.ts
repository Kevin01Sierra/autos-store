import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
import { DATABASE } from './database.tokens.js';

/**
 * Una única conexión administrada por el contenedor de DI (en lugar de un Singleton manual).
 * `prepare: false` es obligatorio con el pooler de Supabase en modo transaction.
 */
@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const client = postgres(config.getOrThrow<string>('DATABASE_URL'), {
          prepare: false,
          max: 5,
        });
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
