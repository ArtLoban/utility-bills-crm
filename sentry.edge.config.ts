// Edge runtime Sentry init. Imported by instrumentation.ts's register() when
// NEXT_RUNTIME === "edge". Must not import the ALS correlation context —
// node:async_hooks is unavailable on the edge runtime — so events here carry no
// correlation-id tag (the proxy, the only edge code, does not throw domain errors).
import * as Sentry from "@sentry/nextjs";

import { baseSentryOptions } from "@/lib/observability/sentry-options";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  ...baseSentryOptions,
});
