import { REDACT_CENSOR, SENSITIVE_KEYS } from "@/lib/logger/redaction";

// Sentry-side scrubbing, aligned to the same SENSITIVE_KEYS the pino `redact`
// option uses — so the identical set of fields is stripped from both channels
// (logs and Sentry events). Runs in `beforeSend`, before the event leaves the
// process.
//
// Deliberately framework-light: operates on a plain object graph (a Sentry
// ErrorEvent is one) so it stays pure, edge/client-safe, and unit-testable
// without importing the Sentry types.

const sensitive = new Set(SENSITIVE_KEYS.map((key) => key.toLowerCase()));

const isSensitiveKey = (key: string): boolean => sensitive.has(key.toLowerCase());

// Walks the event graph in place: replaces the value at any sensitive key with
// the censor, recurses into the rest. `seen` guards against circular references.
const scrubInPlace = (node: Record<string, unknown>, seen: WeakSet<object>): void => {
  for (const [key, value] of Object.entries(node)) {
    if (isSensitiveKey(key)) {
      node[key] = REDACT_CENSOR;
    } else if (value !== null && typeof value === "object" && !seen.has(value)) {
      seen.add(value);
      scrubInPlace(value as Record<string, unknown>, seen);
    }
  }
};

export const scrubEvent = <T extends object>(event: T): T => {
  scrubInPlace(event as Record<string, unknown>, new WeakSet());
  return event;
};
