import pino from "pino";
import pretty from "pino-pretty";

import { getCorrelationId } from "./correlation-context";
import { PINO_REDACT_PATHS, REDACT_CENSOR } from "./redaction";

const isDev = process.env.NODE_ENV === "development";

// pino.transport() spawns a worker thread — its stdout is not captured by Next.js dev server.
// pino-pretty as a stream runs synchronously in the same thread, output reaches the console.
const stream = isDev
  ? pretty({ colorize: true, ignore: "pid,hostname", translateTime: "HH:MM:ss" })
  : undefined;

export const logger = pino(
  {
    level: isDev ? "debug" : "info",
    // Strip PII/secrets from every log line — see redaction.ts for the policy.
    redact: { paths: PINO_REDACT_PATHS, censor: REDACT_CENSOR },
    // Attach the request-scoped correlation id to every line emitted inside a
    // runWithCorrelationId() scope. Empty outside a context (e.g. RSC renders,
    // which pass the id explicitly via the header reader instead).
    mixin: () => {
      const correlationId = getCorrelationId();
      return correlationId ? { correlationId } : {};
    },
    // Serialize a logged `err` to { type, message, stack } rather than dumping
    // its enumerable own-properties (which could smuggle unredacted fields).
    serializers: { err: pino.stdSerializers.err },
  },
  stream,
);
