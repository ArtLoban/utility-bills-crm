import { z } from "zod";

export const SERVICE_LIMITS = {
  notes: 1000,
} as const;

export const createServiceSchema = z.object({
  propertyId: z.string().uuid(),
  serviceTypeId: z.string().uuid(),
  notes: z
    .string()
    .trim()
    .max(SERVICE_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const editServiceSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(SERVICE_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateServiceInput = z.infer<typeof createServiceSchema>;
export type TEditServiceInput = z.infer<typeof editServiceSchema>;
