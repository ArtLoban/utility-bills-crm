// Client (browser) runtime Sentry init. Next loads this automatically; it
// replaces the legacy sentry.client.config.ts. No ALS or server secrets here —
// the browser uses the public DSN and the same scrubbing/no-PII policy.
import * as Sentry from "@sentry/nextjs";

import { baseSentryOptions } from "@/lib/observability/sentry-options";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  ...baseSentryOptions,
  // Drop noise from Telegram's Android in-app browser: its injected
  // TelegramWebviewProxy bridge calls postEvent for service events and throws
  // "Error invoking postEvent: Method not found" on some client versions. Not
  // an app fault — anchored on the postEvent phrase so real errors still report.
  ignoreErrors: ["Error invoking postEvent"],
});

// Required by Sentry to instrument App Router client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
