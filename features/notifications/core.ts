import type { TReminderAnchorType } from "@/lib/db/schema/notifications";
import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";

// The anchor part of a reminder — the only fields the firing decision depends on.
export type TReminderAnchor = {
  anchorType: TReminderAnchorType;
  anchorValue: number;
};

// A civil (wall-clock) calendar date in Europe/Kyiv. month is 1-based (1 = January).
// Deriving "today" in Kyiv from an instant is the caller's job (delivery, later slice);
// this core reasons purely on the civil date it is handed.
export type TCivilDate = {
  year: number;
  month: number;
  day: number;
};

// Days in a given civil month. `Date.UTC(year, month, 0)` is day 0 of the *next* month
// (month is 0-based in Date.UTC, so passing the 1-based month lands on the next month),
// i.e. the last day of the target month. UTC keeps it free of timezone drift.
const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

// Does the reminder fire on the given civil date?
//   day_of_month   — fires on `anchorValue`, clamped to the month's last day
//                    (value 31 fires on Feb 28/29, Apr 30, …).
//   days_before_end — fires `anchorValue` days before month end; value 0 = the last day.
export const reminderFiresOn = (anchor: TReminderAnchor, date: TCivilDate): boolean => {
  const monthLength = daysInMonth(date.year, date.month);

  switch (anchor.anchorType) {
    case REMINDER_ANCHOR_TYPES.DAY_OF_MONTH:
      return date.day === Math.min(anchor.anchorValue, monthLength);
    case REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END:
      return date.day === monthLength - anchor.anchorValue;
  }
};
