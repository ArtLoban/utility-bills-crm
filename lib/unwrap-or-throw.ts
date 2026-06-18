import { notFound } from "next/navigation";

import { type DomainError, type Result, shouldHideAsNotFound } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { resolveCorrelationId } from "@/lib/logger/resolve-correlation-id";

// The single boundary where a Result is unwrapped at a Server Component / Server
// Action edge. Centralizes the formerly-duplicated
//   if (shouldHideAsNotFound(result.error)) notFound();
//   throw result.error;
// pattern so that *every* unexpected error reaching a boundary is also a
// structured log line, tagged with the request's correlation id.
//
// - ok            → return the value.
// - hideable      → notFound() (expected: a missing/forbidden resource hidden as
//                   404 per #108) — NOT logged, it is not a fault.
// - otherwise     → log a structured error with the correlation id, then throw so
//                   it bubbles to error.tsx (and Sentry, once wired in Step 2).
export const unwrapOrThrow = async <T, E extends DomainError>(result: Result<T, E>): Promise<T> => {
  if (result.ok) return result.value;

  if (shouldHideAsNotFound(result.error)) notFound();

  const correlationId = await resolveCorrelationId();
  logger.error({ correlationId, err: result.error }, "unexpected error reached the error boundary");
  throw result.error;
};
