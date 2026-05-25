import { z } from "zod";

export const PAYMENT_DETAILS_LIMITS = {
  details: 2000,
  notes: 1000,
} as const;

export const createPaymentDetailsSchema = z.object({
  contractId: z.string().uuid(),
  details: z
    .string()
    .trim()
    .min(1, "validation.details.required")
    .max(PAYMENT_DETAILS_LIMITS.details, "validation.details.tooLong"),
  validFrom: z.string().min(1, "validation.validFrom.required"),
  validTo: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(PAYMENT_DETAILS_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const changePaymentDetailsSchema = z.object({
  contractId: z.string().uuid(),
  details: z
    .string()
    .trim()
    .min(1, "validation.details.required")
    .max(PAYMENT_DETAILS_LIMITS.details, "validation.details.tooLong"),
  changeDate: z.string().min(1, "validation.changeDate.required"),
  notes: z
    .string()
    .trim()
    .max(PAYMENT_DETAILS_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const updatePaymentDetailsNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(PAYMENT_DETAILS_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreatePaymentDetailsInput = z.infer<typeof createPaymentDetailsSchema>;
export type TChangePaymentDetailsInput = z.infer<typeof changePaymentDetailsSchema>;
export type TUpdatePaymentDetailsNotesInput = z.infer<typeof updatePaymentDetailsNotesSchema>;
