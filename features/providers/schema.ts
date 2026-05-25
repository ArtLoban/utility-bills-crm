import { z } from "zod";

export const PROVIDER_LIMITS = {
  name: 200,
  website: 500,
  phone: 50,
  notes: 1000,
} as const;

// Error messages are relative keys within the "providers" i18n namespace.
// Consumed by useProviderForm which translates them via useTranslations("providers").
export const providerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.name.required")
    .max(PROVIDER_LIMITS.name, "validation.name.tooLong"),
  website: z
    .string()
    .trim()
    .max(PROVIDER_LIMITS.website, "validation.website.tooLong")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(PROVIDER_LIMITS.phone, "validation.phone.tooLong")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(PROVIDER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TProviderInput = z.infer<typeof providerSchema>;
