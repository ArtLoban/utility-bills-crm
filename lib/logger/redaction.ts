// Single source of truth for fields stripped from observability output.
// Consumed twice: by the pino `redact` option (logs) and by Sentry's server-side
// scrubbing (events) — so the same sensitive fields never leave the process in
// either channel.
//
// Policy:
// - REDACT true PII / secrets: email, monetary amounts, account numbers, meter
//   readings, person names, tokens and secrets.
// - ALLOW low-sensitivity operational identifiers that aid debugging: `userId`,
//   `correlationId`, `chatId` (these are intentionally absent from the list).

export const SENSITIVE_KEYS: readonly string[] = [
  "email",
  "amount",
  "accountNumber",
  "meterReading",
  "reading",
  "name",
  "token",
  "secret",
  "password",
  "authorization",
  "apiKey",
];

export const REDACT_CENSOR = "[REDACTED]";

// pino redact paths: each key both at the top level and one level deep
// (`*.key` matches the key inside any direct child object), covering the
// shallow payloads we log.
export const PINO_REDACT_PATHS: string[] = SENSITIVE_KEYS.flatMap((key) => [key, `*.${key}`]);
