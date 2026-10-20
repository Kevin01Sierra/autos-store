import type { ArgumentsHost } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { describe, expect, it, vi } from 'vitest';
import { PostgresErrorFilter } from '../../src/shared/http/postgres-error.filter.js';

function respond(code: string) {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  } as unknown as ArgumentsHost;
  const error = new DrizzleQueryError('insert into brands', [], Object.assign(new Error('pg'), { code }));
  new PostgresErrorFilter().catch(error, host);
  return { status, json };
}

describe('PostgresErrorFilter', () => {
  it('un valor repetido responde 409 con un mensaje claro', () => {
    const { status, json } = respond('23505');
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Ya existe un registro con esos datos' }));
  });

  it('borrar un registro en uso responde 409', () => {
    expect(respond('23503').status).toHaveBeenCalledWith(409);
  });

  it('cualquier otra falla sigue siendo 500', () => {
    expect(respond('08006').status).toHaveBeenCalledWith(500);
  });
});
