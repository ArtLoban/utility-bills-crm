// Server (Node.js) runtime Sentry init. Imported by instrumentation.ts's
// register() when NEXT_RUNTIME === "nodejs".
import * as Sentry from "@sentry/nextjs";

import { getCorrelationId } from "@/lib/logger/correlation-context";
import { baseSentryOptions } from "@/lib/observability/sentry-options";
import { scrubEvent } from "@/lib/observability/scrub-event";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  ...baseSentryOptions,
  // Bridge logs ↔ errors: tag the event with the request's correlation id from
  // the ALS context (present inside runWithCorrelationId scopes, e.g. the cron
  // and webhook routes), so a Sentry event pivots to its matching pino lines.
  // RSC/server-component errors are tagged separately in onRequestError, which
  // reads the forwarded header. Scrubbing always runs last.
  beforeSend: (event) => {
    const correlationId = getCorrelationId();
    if (correlationId) {
      event.tags = { ...event.tags, correlationId };
    }
    return scrubEvent(event);
  },
});
