import { z } from "zod";

export const TARIFF_LIMITS = {
  notes: 1000,
} as const;

// Error message keys are namespaced under the "tariffs" i18n namespace.

// Numeric rate/amount validation: an empty string is allowed (rateT2/rateT3 are optional and
// the metered/fixed XOR is enforced separately); a non-empty value must be a valid decimal
// matching the DB CHECK constraints — rates > 0, fixed amount >= 0.
// Exported for reuse by the service-setup schemas (client + composite action).
const numericString = (predicate: (n: number) => boolean, invalidKey: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || predicate(Number(value)), invalidKey);

export const rateField = numericString((n) => !Number.isNaN(n) && n > 0, "validation.rate.invalid");
export const fixedAmountField = numericString(
  (n) => !Number.isNaN(n) && n >= 0,
  "validation.amount.invalid",
);
const notesField = z
  .string()
  .trim()
  .max(TARIFF_LIMITS.notes, "validation.notes.tooLong")
  .optional()
  .or(z.literal(""));

// Exactly one of {rates, fixed} must be supplied. Shared by create/change/form schemas.
const refineRateXorFixed = (
  data: { rateT1?: string; fixedAmount?: string },
  ctx: z.RefinementCtx,
): void => {
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
};

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
    notes: notesField,
  })
  .superRefine(refineRateXorFixed);

// Fields shared between the action schema (with contractId) and the client form
// schema (without it). The form schema drops contractId — injected at submit.
const changeTariffFields = {
  changeDate: z.string().min(1, "validation.changeDate.required"),
  rateT1: rateField,
  rateT2: rateField,
  rateT3: rateField,
  fixedAmount: fixedAmountField,
  notes: notesField,
};

export const changeTariffSchema = z
  .object({ contractId: z.string().uuid(), ...changeTariffFields })
  .superRefine(refineRateXorFixed);

export const changeTariffFormSchema = z.object(changeTariffFields).superRefine(refineRateXorFixed);

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
export type TChangeTariffForm = z.infer<typeof changeTariffFormSchema>;
export type TUpdateTariffNotesInput = z.infer<typeof updateTariffNotesSchema>;
