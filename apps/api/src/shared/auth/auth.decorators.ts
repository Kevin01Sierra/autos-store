import {
  applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Role } from '@autos/contracts';
import { ROLES_KEY, type AuthUser } from './auth-user.js';
import { AuthGuard } from './auth.guard.js';

/** Protege un endpoint; sin roles basta con estar autenticado. */
export const Auth = (...roles: Role[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(AuthGuard), ApiBearerAuth());

/** Inyecta el usuario autenticado en el handler. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
