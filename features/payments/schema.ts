import { z } from "zod";

export const PAYMENT_LIMITS = {
  notes: 1000,
} as const;

export const createPaymentSchema = z.object({
  serviceId: z.string().uuid("Invalid service"),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date — expected YYYY-MM-DD"),
  // z.number() (not coerce) — the form already sends a number from valueAsNumber.
  amount: z.number().positive("Amount must be greater than 0"),
  notes: z.string().trim().max(PAYMENT_LIMITS.notes).optional().or(z.literal("")),
});

// Backward-compat alias so use-payment-form can be migrated incrementally.
export const paymentSchema = createPaymentSchema;

// Only paidAt, amount, notes are editable — serviceId is immutable after creation.
export const updatePaymentSchema = z.object({
  paidAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date — expected YYYY-MM-DD")
    .optional(),
  amount: z.number().positive("Amount must be greater than 0").optional(),
  notes: z.string().trim().max(PAYMENT_LIMITS.notes).optional().or(z.literal("")),
});

export type TPaymentInput = z.infer<typeof createPaymentSchema>;
export type TCreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type TUpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
