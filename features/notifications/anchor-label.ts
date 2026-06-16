import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";

import type { TReminderAnchor } from "./core";

export type TAnchorDescription =
  | { kind: "dayOfMonth"; day: number }
  | { kind: "lastDay" }
  | { kind: "daysBeforeEnd"; days: number };

export const describeReminderAnchor = (anchor: TReminderAnchor): TAnchorDescription => {
  switch (anchor.anchorType) {
    case REMINDER_ANCHOR_TYPES.DAY_OF_MONTH:
      return {
        kind: "dayOfMonth",
        day: anchor.anchorValue,
      };
    case REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END:
      return anchor.anchorValue === 0
        ? { kind: "lastDay" }
        : {
            kind: "daysBeforeEnd",
            days: anchor.anchorValue,
          };
  }
};
