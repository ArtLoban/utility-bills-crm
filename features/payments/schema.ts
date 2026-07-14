import { z } from "zod";

export const PAYMENT_LIMITS = {
  notes: 1000,
} as const;

// "YYYY-MM-DD" — the payment date (matches ISO_DATE_FORMAT).
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const createPaymentSchema = z.object({
  serviceId: z.string().uuid("Invalid service"),
  paidAt: z.string().regex(ISO_DATE_PATTERN, "Invalid date — expected YYYY-MM-DD"),
  // z.number() (not coerce) — the form already sends a number from valueAsNumber.
  amount: z.number().positive("Amount must be greater than 0"),
  notes: z.string().trim().max(PAYMENT_LIMITS.notes).optional().or(z.literal("")),
});

// Backward-compat alias so use-payment-form can be migrated incrementally.
export const paymentSchema = createPaymentSchema;

// Only paidAt, amount, notes are editable — serviceId is immutable after creation.
export const updatePaymentSchema = z.object({
  paidAt: z.string().regex(ISO_DATE_PATTERN, "Invalid date — expected YYYY-MM-DD").optional(),
  amount: z.number().positive("Amount must be greater than 0").optional(),
  notes: z.string().trim().max(PAYMENT_LIMITS.notes).optional().or(z.literal("")),
});

export type TPaymentInput = z.infer<typeof createPaymentSchema>;
export type TCreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type TUpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

// Client form schema. Messages are relative i18n keys under the "payments" namespace,
// translated by useLocalizedZodForm. `amount` stays a string (the input model) and is converted
// to a number at the action boundary, which keeps this schema transform-free.
// `property` is not persisted on the payment (the link is via `serviceId`), but it is
// required in the form: the user must pick a property to load and choose its services.
export const paymentFormSchema = z.object({
  property: z.string().min(1, "validation.property.required"),
  serviceId: z.string().min(1, "validation.service.required"),
  paidAt: z.string().regex(ISO_DATE_PATTERN, "validation.date.invalid"),
  amount: z
    .string()
    .min(1, "validation.amount.required")
    .refine(
      (value) => value !== "" && !Number.isNaN(Number(value)) && Number(value) > 0,
      "validation.amount.invalid",
    ),
  notes: z
    .string()
    .trim()
    .max(PAYMENT_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TPaymentFormValues = z.infer<typeof paymentFormSchema>;
