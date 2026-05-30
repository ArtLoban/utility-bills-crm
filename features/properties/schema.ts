import { z } from "zod";
import { PROPERTY_TYPE_LIST } from "@/lib/db/schema/properties";

export const PROPERTY_LIMITS = {
  name: 100,
  address: 200,
  notes: 1000,
} as const;

// Error messages are relative keys within the "properties" i18n namespace.
// Consumed by usePropertyForm which translates them via useTranslations("properties").
export const propertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.name.required")
    .max(PROPERTY_LIMITS.name, "validation.name.tooLong"),
  type: z.enum(PROPERTY_TYPE_LIST),
  address: z
    .string()
    .trim()
    .max(PROPERTY_LIMITS.address, "validation.address.tooLong")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(PROPERTY_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TPropertyInput = z.infer<typeof propertySchema>;
