import { z } from "zod";

export const PROFILE_LIMITS = {
  name: 100,
} as const;

// Error messages are relative keys within the "settings.profile" i18n namespace.
export const profileNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.name.required")
    .max(PROFILE_LIMITS.name, "validation.name.tooLong"),
});

export type TProfileNameInput = z.infer<typeof profileNameSchema>;
