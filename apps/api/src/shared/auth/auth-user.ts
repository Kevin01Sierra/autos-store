import type { Role } from '@autos/contracts';

export interface AuthUser {
  id: string;
  email?: string;
  role: Role;
}

/** Puerto: verifica un token y devuelve el id del usuario. */
export interface TokenVerifier {
  verify(token: string): Promise<{ userId: string; email?: string }>;
}

/** Puerto: obtiene el rol del usuario desde su perfil. */
export interface RoleReader {
  roleOf(userId: string): Promise<Role>;
}

export const TOKEN_VERIFIER = Symbol('TOKEN_VERIFIER');
export const ROLE_READER = Symbol('ROLE_READER');
export const ROLES_KEY = 'roles';
