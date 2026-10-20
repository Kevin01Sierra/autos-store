import {
  CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@autos/contracts';
import type { Request } from 'express';
import {
  ROLE_READER, ROLES_KEY, TOKEN_VERIFIER, type AuthUser, type RoleReader, type TokenVerifier,
} from './auth-user.js';

/** Autentica el JWT de Supabase y autoriza por rol (admin / customer). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_VERIFIER) private readonly verifier: TokenVerifier,
    @Inject(ROLE_READER) private readonly roles: RoleReader,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    request.user = await this.authenticate(request.headers.authorization);
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (required?.length && !required.includes(request.user.role)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }
    return true;
  }

  private async authenticate(header?: string): Promise<AuthUser> {
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new UnauthorizedException('Falta el token de acceso');
    try {
      const { userId, email } = await this.verifier.verify(token);
      return { id: userId, email, role: await this.roles.roleOf(userId) };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
