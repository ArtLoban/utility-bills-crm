import * as Sentry from "@sentry/nextjs";

import { CORRELATION_ID_HEADER } from "@/lib/logger/constants";

// Next 16 instrumentation entry. register() runs once per runtime at startup and
// loads the matching Sentry init; onRequestError captures server-side and RSC
// errors (the audit's real targets — thrown non-domain errors).
export const register = async (): Promise<void> => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
};

// Wrap captureRequestError to tag the event with the request's correlation id.
// The proxy forwards it on the x-correlation-id request header, so RSC and
// server-component errors can be pivoted to their matching pino log lines.
export const onRequestError: typeof Sentry.captureRequestError = (error, request, errorContext) => {
  const headerValue = request.headers?.[CORRELATION_ID_HEADER];
  const correlationId = typeof headerValue === "string" ? headerValue : undefined;

  return Sentry.withScope((scope) => {
    if (correlationId) scope.setTag("correlationId", correlationId);
    return Sentry.captureRequestError(error, request, errorContext);
  });
};
