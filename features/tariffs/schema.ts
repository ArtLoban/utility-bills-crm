import { z } from "zod";

export const TARIFF_LIMITS = {
  notes: 1000,
} as const;

// Error message keys are namespaced under the "tariffs" i18n namespace.

// Numeric rate/amount validation: must be a valid positive/non-negative decimal string.
const rateField = z.string().trim().optional().or(z.literal(""));
const fixedAmountField = z.string().trim().optional().or(z.literal(""));

export const createTariffSchema = z
  .object({
    contractId: z.string().uuid(),
    validFrom: z.string().min(1, "validation.validFrom.required"),
    validTo: z.string().optional().or(z.literal("")),
    // Metered shape
    rateT1: rateField,
    rateT2: rateField,
    rateT3: rateField,
    // Fixed shape
    fixedAmount: fixedAmountField,
    notes: z
      .string()
      .trim()
      .max(TARIFF_LIMITS.notes, "validation.notes.tooLong")
      .optional()
      .or(z.literal("")),
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

export const changeTariffSchema = z
  .object({
    contractId: z.string().uuid(),
    changeDate: z.string().min(1, "validation.changeDate.required"),
    rateT1: rateField,
    rateT2: rateField,
    rateT3: rateField,
    fixedAmount: fixedAmountField,
    notes: z
      .string()
      .trim()
      .max(TARIFF_LIMITS.notes, "validation.notes.tooLong")
      .optional()
      .or(z.literal("")),
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

export const updateTariffNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(TARIFF_LIMITS.notes, "validation.notes.tooLong")
    .optional()
    .or(z.literal("")),
});

export type TCreateTariffInput = z.infer<typeof createTariffSchema>;
export type TChangeTariffInput = z.infer<typeof changeTariffSchema>;
export type TUpdateTariffNotesInput = z.infer<typeof updateTariffNotesSchema>;
