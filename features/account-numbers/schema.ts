import { z } from "zod";

export const ACCOUNT_NUMBER_LIMITS = {
  value: 200,
  notes: 1000,
} as const;

export const createAccountNumberSchema = z.object({
  contractId: z.string().uuid(),
  value: z
    .string()
    .trim()
    .min(1, "validation.value.required")
    .max(ACCOUNT_NUMBER_LIMITS.value, "validation.value.tooLong"),
  validFrom: z.string().min(1, "validation.validFrom.required"),
  validTo: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(ACCOUNT_NUMBER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const changeAccountNumberSchema = z.object({
  contractId: z.string().uuid(),
  value: z
    .string()
    .trim()
    .min(1, "validation.value.required")
    .max(ACCOUNT_NUMBER_LIMITS.value, "validation.value.tooLong"),
  changeDate: z.string().min(1, "validation.changeDate.required"),
  notes: z
    .string()
    .trim()
    .max(ACCOUNT_NUMBER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const updateAccountNumberNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(ACCOUNT_NUMBER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

// Client form schema — drops contractId (injected at submit).
export const changeAccountNumberFormSchema = changeAccountNumberSchema.omit({ contractId: true });

export type TCreateAccountNumberInput = z.infer<typeof createAccountNumberSchema>;
export type TChangeAccountNumberInput = z.infer<typeof changeAccountNumberSchema>;
export type TChangeAccountNumberForm = z.infer<typeof changeAccountNumberFormSchema>;
export type TUpdateAccountNumberNotesInput = z.infer<typeof updateAccountNumberNotesSchema>;
