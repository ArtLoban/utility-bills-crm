import { type TCreateServiceWithSetupInput } from "@/features/services/schema";
import type { PropertyId } from "@/lib/db/schema/properties";
import { type TServiceSetupForm } from "../schema";

export const buildActionInput = (
  values: TServiceSetupForm,
  propertyId: PropertyId,
): TCreateServiceWithSetupInput => {
  const {
    serviceTypeId,
    serviceNotes,
    providerId,
    contractValidFrom,
    contractNotes,
    tariffValidFrom,
    rateT1,
    rateT2,
    rateT3,
    fixedAmount,
    tariffNotes,
    meterEngaged,
    meter,
  } = values;

  const base: TCreateServiceWithSetupInput = {
    propertyId,
    serviceTypeId,
    serviceNotes: serviceNotes || undefined,
    providerId,
    contractValidFrom,
    contractNotes: contractNotes || undefined,
    tariffValidFrom,
    rateT1: rateT1 || undefined,
    rateT2: rateT2 || undefined,
    rateT3: rateT3 || undefined,
    fixedAmount: fixedAmount || undefined,
    tariffNotes: tariffNotes || undefined,
  };

  if (!meterEngaged || !meter.meterValidFrom) return base;

  const { serialNumber, zoneCount, installedAt, meterValidFrom, meterNotes } = meter;

  return {
    ...base,
    meter: {
      serialNumber: serialNumber || undefined,
      zoneCount,
      installedAt: installedAt ? new Date(installedAt).toISOString() : undefined,
      meterValidFrom: new Date(meterValidFrom).toISOString(),
      meterNotes: meterNotes || undefined,
    },
  };
};
