import { z } from "zod";

export const METER_LIMITS = {
  serialNumber: 100,
  notes: 1000,
} as const;

export const createMeterSchema = z.object({
  propertyId: z.string().uuid("validation.propertyId.invalid"),
  serviceTypeId: z.string().uuid("validation.serviceTypeId.invalid"),
  serialNumber: z
    .string()
    .trim()
    .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong")
    .optional()
    .or(z.literal("")),
  zoneCount: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  installedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  validFrom: z.string().datetime({ offset: true, message: "validation.validFrom.required" }),
  notes: z
    .string()
    .trim()
    .max(METER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const replaceMeterSchema = z.object({
  currentMeterId: z.string().uuid("validation.currentMeterId.invalid"),
  replacementDate: z
    .string()
    .datetime({ offset: true, message: "validation.replacementDate.required" }),
  serialNumber: z
    .string()
    .trim()
    .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong")
    .optional()
    .or(z.literal("")),
  zoneCount: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  installedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(METER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export const updateMeterSchema = z.object({
  serialNumber: z
    .string()
    .trim()
    .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong")
    .optional()
    .or(z.literal("")),
  installedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  removedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(METER_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateMeterInput = z.infer<typeof createMeterSchema>;
export type TReplaceMeterInput = z.infer<typeof replaceMeterSchema>;
export type TUpdateMeterInput = z.infer<typeof updateMeterSchema>;
