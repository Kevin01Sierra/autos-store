/** Errores de dominio: el dominio no conoce HTTP; un filtro los traduce a códigos de estado. */
export abstract class DomainError extends Error {
  abstract readonly code: 'NOT_FOUND' | 'CONFLICT' | 'BUSINESS_RULE' | 'FORBIDDEN';
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  constructor(entity: string, id: string) {
    super(`${entity} ${id} no existe`);
  }
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
}

export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE';
}

export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
}
