// Client (browser) runtime Sentry init. Next loads this automatically; it
// replaces the legacy sentry.client.config.ts. No ALS or server secrets here —
// the browser uses the public DSN and the same scrubbing/no-PII policy.
import * as Sentry from "@sentry/nextjs";

import { baseSentryOptions } from "@/lib/observability/sentry-options";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  ...baseSentryOptions,
});

// Required by Sentry to instrument App Router client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
