"use server";

import * as Sentry from "@sentry/nextjs";
import type { SeverityLevel } from "@sentry/nextjs";

import { requireAdmin } from "@/lib/auth/guards";
import { ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { runWithCorrelationId } from "@/lib/logger/correlation-context";
import { resolveCorrelationId } from "@/lib/logger/resolve-correlation-id";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";

// Fake PII attached to the captured event so the maintainer can confirm
// server-side scrubbing works — these must appear as [REDACTED] in Sentry.
const SCRUB_PROBE = {
  email: "probe@example.com",
  amount: 4242.42,
  accountNumber: "ACC-DEBUG-0001",
};

type TCaptureInput = {
  message: string;
  level: SeverityLevel;
  tagKey?: string;
  tagValue?: string;
};

// Throws an uncaught server error. It is captured by instrumentation.ts's
// onRequestError, which tags the event with the correlation id read from the
// proxy-forwarded x-correlation-id header — verifying that capture path.
export const triggerServerError = async (message: string): Promise<never> => {
  await unwrapOrThrow(await requireAdmin());
  throw new Error(message);
};

// Explicitly captures an exception (no throw). Runs inside an ALS correlation
// scope so the server `beforeSend` tags the event with the correlation id (the
// second, distinct tag path), and emits a matching logger.error line so logs
// can be pivoted to the Sentry event.
export const captureServerException = async (input: TCaptureInput): Promise<Result<void>> => {
  await unwrapOrThrow(await requireAdmin());

  const correlationId = await resolveCorrelationId();
  return runWithCorrelationId(correlationId, () => {
    const error = new Error(input.message);
    const tags = input.tagKey && input.tagValue ? { [input.tagKey]: input.tagValue } : undefined;

    logger.error({ correlationId, err: error }, "debug: captured exception triggered");
    Sentry.captureException(error, { level: input.level, tags, extra: { ...SCRUB_PROBE } });

    return ok(undefined);
  });
};
