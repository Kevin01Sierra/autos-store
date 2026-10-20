import { ForbiddenException, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from '../../src/shared/auth/auth.guard.js';

function setup(role: 'admin' | 'customer', required: string[] = []) {
  const verifier = { verify: vi.fn(async (token: string) => {
    if (token !== 'valido') throw new Error('firma inválida');
    return { userId: 'user-1' };
  }) };
  const roles = { roleOf: vi.fn().mockResolvedValue(role) };
  const reflector = { getAllAndOverride: vi.fn().mockReturnValue(required) } as unknown as Reflector;
  const guard = new AuthGuard(reflector, verifier, roles);
  const run = (authorization?: string) => {
    const request: { headers: { authorization?: string }; user?: unknown } = { headers: { authorization } };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => undefined,
      getClass: () => undefined,
    } as unknown as ExecutionContext;
    return guard.canActivate(context).then((ok) => ({ ok, user: request.user }));
  };
  return { run };
}

describe('AuthGuard', () => {
  it('responde 401 sin token o con un token inválido', async () => {
    const { run } = setup('customer');
    await expect(run()).rejects.toThrow(UnauthorizedException);
    await expect(run('Bearer falso')).rejects.toThrow(UnauthorizedException);
  });

  it('responde 403 si el rol no alcanza', async () => {
    const { run } = setup('customer', ['admin']);
    await expect(run('Bearer valido')).rejects.toThrow(ForbiddenException);
  });

  it('deja pasar al admin y adjunta el usuario a la petición', async () => {
    const { run } = setup('admin', ['admin']);
    await expect(run('Bearer valido')).resolves.toEqual({
      ok: true, user: { id: 'user-1', email: undefined, role: 'admin' },
    });
  });
});
