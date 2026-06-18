// --- Domain error model ---
// Expected errors are RETURNED as Result<T, E>, never thrown.
// Unexpected errors (infrastructure, bugs) are thrown and caught by error.tsx.
//
// The RETURNED error is plain serializable data — a discriminated union keyed by
// `code` (TAppError). It must stay plain: a Result crosses the Server Action →
// client boundary, where React Flight collapses every `Error` instance to a bare
// tag in production (no name/message/fields survive). Discriminate by `code`,
// never by `error.name`. See `.claude/lessons/0015-*`.
//
// The Error CLASS hierarchy below exists only to reconstruct a throwable Error at
// the single boundary that throws (unwrapOrThrow) — so Pino and Sentry receive a
// real Error with a meaningful name. Classes are never used as a Result payload.

// --- Error codes (the serializable discriminant) ---

export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION: "VALIDATION",
  DEMO_MODE: "DEMO_MODE",
} as const;

export type TErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type TAppError =
  | { code: typeof ERROR_CODES.NOT_FOUND; entity: string; id?: string }
  | { code: typeof ERROR_CODES.FORBIDDEN; message?: string }
  | { code: typeof ERROR_CODES.VALIDATION; message: string }
  | { code: typeof ERROR_CODES.DEMO_MODE };

// Factories — the single way to construct a returned error. Terse at call-sites
// (`err(appError.notFound("bill", id))`) and they guarantee a plain object.
export const appError = {
  notFound: (entity: string, id?: string): TAppError => ({
    code: ERROR_CODES.NOT_FOUND,
    entity,
    id,
  }),
  forbidden: (message?: string): TAppError => ({ code: ERROR_CODES.FORBIDDEN, message }),
  validation: (message: string): TAppError => ({ code: ERROR_CODES.VALIDATION, message }),
  demo: (): TAppError => ({ code: ERROR_CODES.DEMO_MODE }),
} as const;

// --- Error class hierarchy (reconstruction only — see file header) ---

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

export class DemoModeError extends DomainError {
  constructor() {
    super("DEMO_MODE_BLOCKED");
  }
}

// Rebuild a throwable Error from a returned TAppError. Used only at the throw
// boundary (unwrapOrThrow) so structured logging and Sentry get a real Error.
export const toThrowable = (error: TAppError): DomainError => {
  switch (error.code) {
    case ERROR_CODES.NOT_FOUND:
      return new NotFoundError(error.entity, error.id);
    case ERROR_CODES.FORBIDDEN:
      return new ForbiddenError(error.message);
    case ERROR_CODES.VALIDATION:
      return new ValidationError(error.message);
    case ERROR_CODES.DEMO_MODE:
      return new DemoModeError();
  }
};

// --- Decision #108: ForbiddenError → 404 convention ---
// Both NOT_FOUND and FORBIDDEN map to a 404 response at the HTTP boundary to hide
// the existence of protected resources.
// Usage in Server Components:
//   if (!result.ok) {
//     if (shouldHideAsNotFound(result.error)) notFound();
//     throw toThrowable(result.error);
//   }
export const shouldHideAsNotFound = (error: TAppError): boolean =>
  error.code === ERROR_CODES.NOT_FOUND || error.code === ERROR_CODES.FORBIDDEN;

// Best-effort inline message for client display. Only VALIDATION and FORBIDDEN
// carry a message; NOT_FOUND/DEMO_MODE return null so callers fall back. Returns
// `string | null` to drop straight into a `useState<string | null>` setter.
export const errorMessage = (error: TAppError): string | null =>
  "message" in error && error.message ? error.message : null;

// --- Result<T, E> ---
// Discriminated union for expected outcomes. Use ok() and err() to construct.
// if (result.ok) result.value   → T
// else           result.error   → E
// The error type defaults to TAppError — the plain, serialization-safe shape.

export type Result<T, E = TAppError> = { ok: true; value: T } | { ok: false; error: E };

// ok() returns Result<T, never> so TypeScript widens the error type to whatever
// the enclosing function declares — no explicit type parameters needed at call-sites.
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
