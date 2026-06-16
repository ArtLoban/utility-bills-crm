import { z } from "zod";

import { REMINDER_ANCHOR_TYPES, REMINDER_ANCHOR_TYPE_LIST } from "@/lib/db/schema/notifications";

// Canonical JS-side limits — the Zod source of truth. The DB CHECK constraints repeat
// these literals as defense-in-depth, exactly as every other table hardcodes its checks.
export const REMINDER_LIMITS = { text: 280 } as const;

// anchorValue's valid range is conditioned on anchorType.
export const REMINDER_ANCHOR_RANGES = {
  [REMINDER_ANCHOR_TYPES.DAY_OF_MONTH]: { min: 1, max: 31 },
  [REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END]: { min: 0, max: 27 },
} as const;

const textField = z
  .string()
  .trim()
  .min(1, "validation.text.required")
  .max(REMINDER_LIMITS.text, "validation.text.tooLong");

// One discriminated branch per anchor type — the range belongs to its type, so the
// dependency is modeled as a discriminated union, never as interdependent optional fields.
const anchorBranch = <T extends keyof typeof REMINDER_ANCHOR_RANGES>(anchorType: T) => {
  const { min, max } = REMINDER_ANCHOR_RANGES[anchorType];

  return z.object({
    anchorType: z.literal(anchorType),
    anchorValue: z
      .number()
      .int("validation.anchorValue.integer")
      .min(min, "validation.anchorValue.outOfRange")
      .max(max, "validation.anchorValue.outOfRange"),
    text: textField,
  });
};

const serviceIdField = z.string().uuid("validation.service.invalid");

// Create carries the target service; edit does not — the service is fixed once created,
// and the reminder id is passed as a separate action argument.
export const createReminderSchema = z.discriminatedUnion("anchorType", [
  anchorBranch(REMINDER_ANCHOR_TYPES.DAY_OF_MONTH).extend({
    serviceId: serviceIdField,
  }),
  anchorBranch(REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END).extend({
    serviceId: serviceIdField,
  }),
]);

export const editReminderSchema = z.discriminatedUnion("anchorType", [
  anchorBranch(REMINDER_ANCHOR_TYPES.DAY_OF_MONTH),
  anchorBranch(REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END),
]);

export type TCreateReminderInput = z.infer<typeof createReminderSchema>;
export type TEditReminderInput = z.infer<typeof editReminderSchema>;

// The flat client form model, shared by create and edit. anchorValue is the selected option's
// value as a string (FormSelectField is string-based, and the picker only offers in-range
// values), parsed back to a number at the action boundary. serviceId is supplied from the route
// on create and the reminder id is a separate action argument on edit — neither belongs in the
// form. createReminderSchema/editReminderSchema remain the authoritative server-side gate.
export const reminderFormSchema = z.object({
  anchorType: z.enum(REMINDER_ANCHOR_TYPE_LIST),
  anchorValue: z.string(),
  text: textField,
});

export type TReminderFormValues = z.infer<typeof reminderFormSchema>;
