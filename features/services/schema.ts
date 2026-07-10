import { z } from "zod";

import { CONTRACT_LIMITS } from "@/features/contracts/schema";
import { METER_LIMITS } from "@/features/meters/schema";
import { TARIFF_LIMITS, fixedAmountField, rateField } from "@/features/tariffs/schema";

export const SERVICE_LIMITS = {
  name: 100,
  notes: 1000,
} as const;

const optionalName = z
  .string()
  .trim()
  .max(SERVICE_LIMITS.name, "validation.name.tooLong")
  .optional()
  .or(z.literal(""));

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
  name: optionalName,
  notes: z
    .string()
    .trim()
    .max(SERVICE_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateServiceInput = z.infer<typeof createServiceSchema>;
export type TEditServiceInput = z.infer<typeof editServiceSchema>;

// Composite schema — covers service + contract + tariff + optional meter in one wizard step.
// Cross-slice limit imports (CONTRACT_LIMITS, TARIFF_LIMITS, METER_LIMITS) are pragmatic:
// pure numeric constants, no business logic crossing slice boundaries.

export const createServiceWithSetupSchema = z
  .object({
    // Service
    propertyId: z.string().uuid(),
    serviceTypeId: z.string().uuid(),
    // Custom label. Required for the `other` type — enforced in the action (business
    // logic), where the resolved type code is available; the schema stays type-agnostic.
    name: optionalName,
    serviceNotes: z
      .string()
      .trim()
      .max(SERVICE_LIMITS.notes, "validation.notes.tooLong")
      .optional()
      .or(z.literal("")),

    // Contract
    providerId: z.string().uuid("validation.providerId.required"),
    contractValidFrom: z.string().min(1, "validation.contractValidFrom.required"),
    contractNotes: z
      .string()
      .trim()
      .max(CONTRACT_LIMITS.notes, "validation.notes.tooLong")
      .optional()
      .or(z.literal("")),

    // Tariff
    tariffValidFrom: z.string().min(1, "validation.tariffValidFrom.required"),
    rateT1: rateField.optional(),
    rateT2: rateField.optional(),
    rateT3: rateField.optional(),
    fixedAmount: fixedAmountField.optional(),
    tariffNotes: z
      .string()
      .trim()
      .max(TARIFF_LIMITS.notes, "validation.notes.tooLong")
      .optional()
      .or(z.literal("")),

    // Meter (optional — a service may be set up without a meter)
    meter: z
      .object({
        serialNumber: z
          .string()
          .trim()
          .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong")
          .optional()
          .or(z.literal("")),
        zoneCount: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
        installedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
        meterValidFrom: z.string().datetime({
          offset: true,
          message: "validation.meterValidFrom.required",
        }),
        meterNotes: z
          .string()
          .trim()
          .max(METER_LIMITS.notes, "validation.notes.tooLong")
          .optional()
          .or(z.literal("")),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasRates = !!data.rateT1;
    const hasFixed = !!data.fixedAmount;
    if (!hasRates && !hasFixed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rateT1"],
        message: "validation.rateOrFixedRequired",
      });
    }
    if (hasRates && hasFixed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fixedAmount"],
        message: "validation.rateAndFixedMutuallyExclusive",
      });
    }
  });

export type TCreateServiceWithSetupInput = z.infer<typeof createServiceWithSetupSchema>;
