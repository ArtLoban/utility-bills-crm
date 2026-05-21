// --- Domain error hierarchy ---
// Expected errors are RETURNED as Result<T, E>, never thrown.
// Unexpected errors (infrastructure, bugs) are thrown and caught by error.tsx.

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} "${id}" not found` : `${entity} not found`);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Access denied") {
    super(message);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

// --- Decision #108: ForbiddenError → 404 convention ---
// Both ForbiddenError and NotFoundError map to a 404 response at the HTTP boundary
// to hide the existence of protected resources.
// Usage in Server Components:
//   if (!result.ok) {
//     if (shouldHideAsNotFound(result.error)) notFound();
//     throw result.error;
//   }
export const shouldHideAsNotFound = (error: DomainError): boolean =>
  error instanceof NotFoundError || error instanceof ForbiddenError;

// --- Result<T, E> ---
// Discriminated union for expected outcomes. Use ok() and err() to construct.
// if (result.ok) result.value   → T
// else           result.error   → E

export type Result<T, E = DomainError> = { ok: true; value: T } | { ok: false; error: E };

// ok() returns Result<T, never> so TypeScript widens the error type to whatever
// the enclosing function declares — no explicit type parameters needed at call-sites.
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
