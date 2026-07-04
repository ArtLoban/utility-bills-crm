import { z } from "zod";

import { CONTRACT_LIMITS } from "@/features/contracts/schema";
import { METER_LIMITS } from "@/features/meters/schema";
import { SERVICE_LIMITS } from "@/features/services/schema";
import { TARIFF_LIMITS } from "@/features/tariffs/schema";

export const ServiceSetupFormField = {
  SERVICE_TYPE_ID: "serviceTypeId",
  NAME: "name",
  SERVICE_NOTES: "serviceNotes",
  PROVIDER_ID: "providerId",
  CONTRACT_VALID_FROM: "contractValidFrom",
  CONTRACT_NOTES: "contractNotes",
  TARIFF_VALID_FROM: "tariffValidFrom",
  RATE_T1: "rateT1",
  RATE_T2: "rateT2",
  RATE_T3: "rateT3",
  FIXED_AMOUNT: "fixedAmount",
  TARIFF_NOTES: "tariffNotes",
  METER_ENGAGED: "meterEngaged",
} as const;

export const ServiceMeterField = {
  SERIAL_NUMBER: "meter.serialNumber",
  ZONE_COUNT: "meter.zoneCount",
  INSTALLED_AT: "meter.installedAt",
  METER_VALID_FROM: "meter.meterValidFrom",
  METER_NOTES: "meter.meterNotes",
} as const;

const optionalNotes = (max: number) => z.string().trim().max(max, "validation.notes.tooLong");

const rateField = z.string().trim();

export const serviceSetupFormSchema = z
  .object({
    serviceTypeId: z.string().min(1, "validation.serviceTypeId.required"),
    name: z.string().trim().max(SERVICE_LIMITS.name, "validation.name.tooLong"),
    serviceNotes: optionalNotes(SERVICE_LIMITS.notes),
    providerId: z.string().min(1, "validation.providerId.required"),
    contractValidFrom: z.string().min(1, "validation.contractValidFrom.required"),
    contractNotes: optionalNotes(CONTRACT_LIMITS.notes),
    tariffValidFrom: z.string().min(1, "validation.tariffValidFrom.required"),
    rateT1: rateField,
    rateT2: rateField,
    rateT3: rateField,
    fixedAmount: rateField,
    tariffNotes: optionalNotes(TARIFF_LIMITS.notes),
    meterEngaged: z.boolean(),
    meter: z.object({
      serialNumber: z
        .string()
        .trim()
        .max(METER_LIMITS.serialNumber, "validation.serialNumber.tooLong"),
      zoneCount: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      installedAt: z.string(),
      meterValidFrom: z.string(),
      meterNotes: optionalNotes(METER_LIMITS.notes),
    }),
  })
  .superRefine((data, ctx) => {
    const hasRates = Boolean(data.rateT1);
    const hasFixed = Boolean(data.fixedAmount);
    if (!hasRates && !hasFixed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rateT1"],
        message: "validation.rateOrFixedRequired",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fixedAmount"],
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
    if (data.meterEngaged && !data.meter.meterValidFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["meter", "meterValidFrom"],
        message: "validation.meterValidFrom.required",
      });
    }
  });

export type TServiceSetupForm = z.infer<typeof serviceSetupFormSchema>;
