import type { SeverityLevel } from "@sentry/nextjs";

// Sentry severity levels offered for the captured-exception trigger.
export const SENTRY_LEVELS: readonly SeverityLevel[] = ["fatal", "error", "warning", "info"];

export const DEFAULT_DEBUG_MESSAGE = "Debug test error from /art-admin/debug";

// Inline-code styling shared by the trigger descriptions and the Telegram card.
export const CODE_CLASS = "bg-muted rounded px-1 py-0.5 font-mono text-xs";
