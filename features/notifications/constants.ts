import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import type { TReminderAnchorType } from "@/lib/db/schema/notifications";

export const REMINDER_LAST_DAY_FALLBACK_DAYS: readonly number[] = [29, 30, 31];

export const REMINDER_DAYS_BEFORE_END_PRESETS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export const REMINDER_ANCHOR_DEFAULT_VALUE: Record<TReminderAnchorType, number> = {
  [REMINDER_ANCHOR_TYPES.DAY_OF_MONTH]: 1,
  [REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END]: 0,
};
