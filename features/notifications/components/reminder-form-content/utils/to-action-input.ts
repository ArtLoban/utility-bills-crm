import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import type { TServiceId } from "@/lib/db/schema/services";

import type {
  TCreateReminderInput,
  TEditReminderInput,
  TReminderFormValues,
} from "../../../schema";

export const toCreateInput = (
  values: TReminderFormValues,
  serviceId: TServiceId,
): TCreateReminderInput =>
  values.anchorType === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH
    ? {
        anchorType: values.anchorType,
        anchorValue: Number(values.anchorValue),
        text: values.text,
        serviceId,
      }
    : {
        anchorType: values.anchorType,
        anchorValue: Number(values.anchorValue),
        text: values.text,
        serviceId,
      };

export const toEditInput = (values: TReminderFormValues): TEditReminderInput =>
  values.anchorType === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH
    ? { anchorType: values.anchorType, anchorValue: Number(values.anchorValue), text: values.text }
    : { anchorType: values.anchorType, anchorValue: Number(values.anchorValue), text: values.text };
