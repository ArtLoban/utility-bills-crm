import { z } from "zod";

export const CONTRACT_LIMITS = {
  notes: 1000,
} as const;

// Error message keys are relative to the "contracts" i18n namespace.

export const createContractSchema = z.object({
  serviceId: z.string().uuid(),
  providerId: z.string().uuid("validation.providerId.required"),
  validFrom: z.string().min(1, "validation.validFrom.required"),
  notes: z
    .string()
    .trim()
    .max(CONTRACT_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const changeProviderSchema = z.object({
  serviceId: z.string().uuid(),
  newProviderId: z.string().uuid("validation.providerId.required"),
  changeDate: z.string().min(1, "validation.changeDate.required"),
  notes: z
    .string()
    .trim()
    .max(CONTRACT_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const updateContractNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(CONTRACT_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateContractInput = z.infer<typeof createContractSchema>;
export type TChangeProviderInput = z.infer<typeof changeProviderSchema>;
export type TUpdateContractNotesInput = z.infer<typeof updateContractNotesSchema>;
