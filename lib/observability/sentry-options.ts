import { scrubEvent } from "./scrub-event";

// Init options shared by every runtime's Sentry.init (server, edge, client).
// Per the task: error tracking only — no performance tracing — and never the
// SDK's default PII. `beforeSend` scrubs each event against SENSITIVE_KEYS.
//
// The server runtime spreads this and overrides `beforeSend` to additionally
// tag the event with the request's correlation id (read from ALS), which is
// not available in the edge/client runtimes.
export const baseSentryOptions = {
  tracesSampleRate: 0,
  sendDefaultPii: false,
  beforeSend: scrubEvent,
};
