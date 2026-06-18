import { AsyncLocalStorage } from "node:async_hooks";

// Request-scoped correlation-id context. Seeded once at a request entry point
// (Node route handlers via runWithCorrelationId); every logger call inside that
// async scope then reads the id back through the pino `mixin` — no threading
// through function signatures.
//
// Node-only: AsyncLocalStorage is a node:async_hooks API and the Edge proxy must
// never import it (the proxy does not log — it only forwards the id on headers).
// The Edge → Node boundary is crossed by the `x-correlation-id` header, not by ALS.

type TCorrelationStore = { correlationId: string };

const storage = new AsyncLocalStorage<TCorrelationStore>();

export const runWithCorrelationId = <T>(correlationId: string, fn: () => T): T =>
  storage.run({ correlationId }, fn);

// Synchronous read of the active id (or undefined outside any context).
// Used by the pino mixin and the Sentry correlation-id tag.
export const getCorrelationId = (): string | undefined => storage.getStore()?.correlationId;
