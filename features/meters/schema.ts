import { z } from "zod";

import { ZONE_COUNT_VALUES } from "@/lib/constants/zones";

export const METER_LIMITS = {
  serialNumber: 100,
  notes: 1000,
} as const;

// Numeric zone-count validation, shared by create + replace action schemas.
const zoneCountSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1);

export const createMeterSchema = z.object({
  propertyId: z.string().uuid("validation.propertyId.invalid"),
  serviceTypeId: z.string().uuid("validation.serviceTypeId.invalid"),
  // The specific service line(s) this meter feeds (Slice B2). At least one; the action validates
  // they belong to the property and share the meter's (metered) service type.
  serviceIds: z
    .array(z.string().uuid("validation.serviceIds.invalid"))
    .min(1, "validation.serviceIds.required"),
  serialNumber: z
    .string()
    .trim()
    .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong")
    .optional()
    .or(z.literal("")),
  zoneCount: zoneCountSchema,
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
  zoneCount: zoneCountSchema,
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

// ----- Client form schema (Replace meter) -----
// The form holds raw strings; the hook parses dates to datetime-with-offset and zoneCount
// to a number on submit (replaceMeterSchema above re-validates the parsed payload). Messages
// are relative i18n keys against the "meters" namespace.
export const replaceMeterFormSchema = z.object({
  replacementDate: z.string().min(1, "validation.replacementDate.required"),
  serialNumber: z.string().max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong"),
  zoneCount: z.enum(ZONE_COUNT_VALUES),
  installedAt: z.string(),
  notes: z.string().max(METER_LIMITS.notes, "validation.notes.tooLong"),
});

export type TReplaceMeterFormValues = z.infer<typeof replaceMeterFormSchema>;

// ----- Client form schema (Add meter) -----
// Like the replace form: raw strings; the hook parses dates to datetime-with-offset and zoneCount
// to a number on submit (createMeterSchema re-validates the parsed payload). serviceTypeId is part
// of the form (the user picks it); propertyId comes from the route, not the form.
export const createMeterFormSchema = z.object({
  serviceTypeId: z.string().min(1, "validation.serviceTypeId.required"),
  serviceIds: z.array(z.string()).min(1, "validation.serviceIds.required"),
  serialNumber: z.string().max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong"),
  zoneCount: z.enum(ZONE_COUNT_VALUES),
  installedAt: z.string(),
  validFrom: z.string().min(1, "validation.validFrom.required"),
  notes: z.string().max(METER_LIMITS.notes, "validation.notes.tooLong"),
});

export type TCreateMeterFormValues = z.infer<typeof createMeterFormSchema>;
