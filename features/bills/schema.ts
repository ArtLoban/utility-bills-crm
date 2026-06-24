import { z } from "zod";

export const BILL_LIMITS = {
  notes: 1000,
} as const;

// "YYYY-MM" — the period month. The action expands it into the date triple.
export const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const monthSchema = z.string().regex(MONTH_PATTERN, "Invalid month format — expected YYYY-MM");

export const createBillSchema = z.object({
  serviceId: z.string().uuid("Invalid service"),
  month: monthSchema,
  amount: z.coerce.number().min(0, "Amount must be 0 or greater"),
  notes: z
    .string()
    .trim()
    .max(BILL_LIMITS.notes, `Notes must be ${BILL_LIMITS.notes} characters or fewer`)
    .optional()
    .or(z.literal("")),
});

export const updateBillSchema = z.object({
  month: monthSchema.optional(),
  amount: z.coerce.number().min(0, "Amount must be 0 or greater").optional(),
  notes: z
    .string()
    .trim()
    .max(BILL_LIMITS.notes, `Notes must be ${BILL_LIMITS.notes} characters or fewer`)
    .optional()
    .or(z.literal("")),
});

export type TCreateBillInput = z.infer<typeof createBillSchema>;
export type TUpdateBillInput = z.infer<typeof updateBillSchema>;

// Client form schema. Messages are relative i18n keys under the "bills" namespace,
// translated by useZodForm. `amount` stays a string (the input model) and is converted
// to a number at the action boundary, which keeps this schema transform-free.
// `property` is not persisted on the bill (the link is via `serviceId`), but it is required
// in the form: the user must pick a property to load and choose its services.
export const billFormSchema = z.object({
  property: z.string().min(1, "validation.property.required"),
  serviceId: z.string().min(1, "validation.service.required"),
  month: z.string().regex(MONTH_PATTERN, "validation.month.invalid"),
  amount: z
    .string()
    .min(1, "validation.amount.required")
    .refine(
      (value) => value !== "" && !Number.isNaN(Number(value)) && Number(value) >= 0,
      "validation.amount.invalid",
    ),
  notes: z
    .string()
    .trim()
    .max(BILL_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TBillFormValues = z.infer<typeof billFormSchema>;
