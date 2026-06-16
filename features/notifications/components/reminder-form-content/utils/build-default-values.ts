import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";

import { REMINDER_ANCHOR_DEFAULT_VALUE } from "../../../constants";
import type { TReminderFormValues } from "../../../schema";
import type { TReminderListItem } from "../../../query";

export const buildDefaultValues = (reminder?: TReminderListItem): TReminderFormValues =>
  reminder
    ? {
        anchorType: reminder.anchorType,
        anchorValue: String(reminder.anchorValue),
        text: reminder.text,
      }
    : {
        anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
        anchorValue: String(REMINDER_ANCHOR_DEFAULT_VALUE[REMINDER_ANCHOR_TYPES.DAY_OF_MONTH]),
        text: "",
      };
