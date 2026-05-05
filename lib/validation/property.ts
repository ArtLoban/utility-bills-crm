import { z } from "zod";

export const propertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "properties.validation.name.required")
    .max(100, "properties.validation.name.tooLong"),
  type: z.enum(["apartment", "house", "cottage", "other"]),
  address: z
    .string()
    .trim()
    .max(200, "properties.validation.address.tooLong")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(1000, "properties.validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TPropertyInput = z.infer<typeof propertySchema>;
