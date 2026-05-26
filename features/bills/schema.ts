import { z } from "zod";

export const BILL_LIMITS = {
  notes: 1000,
} as const;

// "YYYY-MM" format — the action expands this into the date triple.
const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format — expected YYYY-MM");

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
