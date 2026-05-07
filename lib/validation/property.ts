import { z } from "zod";

export const PROPERTY_LIMITS = {
  name: 100,
  address: 200,
  notes: 1000,
} as const;

export const propertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "properties.validation.name.required")
    .max(PROPERTY_LIMITS.name, "properties.validation.name.tooLong"),
  type: z.enum(["apartment", "house", "cottage", "other"]),
  address: z
    .string()
    .trim()
    .max(PROPERTY_LIMITS.address, "properties.validation.address.tooLong")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(PROPERTY_LIMITS.notes, "properties.validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TPropertyInput = z.infer<typeof propertySchema>;
