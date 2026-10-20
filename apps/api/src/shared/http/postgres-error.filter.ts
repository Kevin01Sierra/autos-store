import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import type { Response } from 'express';

/** Códigos de Postgres que son errores del usuario, no fallas del servidor. */
const CONFLICTS: Record<string, string> = {
  '23505': 'Ya existe un registro con esos datos',
  '23503': 'No se puede completar: el registro está en uso o depende de otro que no existe',
};

/** Traduce violaciones de restricciones (único, llave foránea) a 409 en lugar de 500. */
@Catch(DrizzleQueryError)
export class PostgresErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(PostgresErrorFilter.name);

  catch(error: DrizzleQueryError, host: ArgumentsHost): void {
    const code = (error.cause as { code?: string } | undefined)?.code ?? '';
    const message = CONFLICTS[code];
    if (!message) this.logger.error(error.cause ?? error);
    const status = message ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR;
    host.switchToHttp().getResponse<Response>().status(status).json({
      statusCode: status,
      error: message ? 'CONFLICT' : 'INTERNAL',
      message: message ?? 'Internal server error',
    });
  }
}
