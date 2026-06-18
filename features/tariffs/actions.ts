"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff, TTariffId } from "@/lib/db/schema/tariffs";
import type { TContractId } from "@/lib/db/schema/contracts";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import { tariffByIdForUser, currentTariffForContract } from "@/lib/db/access/tariffs";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { insertTariffInternal } from "./lib";
import { changeTariffSchema, createTariffSchema, updateTariffNotesSchema } from "./schema";
import type { TChangeTariffInput, TCreateTariffInput, TUpdateTariffNotesInput } from "./schema";

// PostgreSQL error code 23P01 = exclusion_violation.
const isExclusionViolation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "23P01";

// Validate that the tariff shape matches the service type's measurement type.
// Returns a ValidationError message key if invalid, null if valid.
const validateTariffShape = (
  measurementType: string,
  rateT1: string | null | undefined,
  fixedAmount: string | null | undefined,
): string | null => {
  if (measurementType === "metered") {
    if (!rateT1) return "validation.tariff.meteredRequiresRates";
    if (fixedAmount) return "validation.tariff.meteredForbidsFixed";
  } else if (measurementType === "fixed") {
    if (!fixedAmount) return "validation.tariff.fixedRequiresAmount";
    if (rateT1) return "validation.tariff.fixedForbidsRates";
  }
  return null;
};

// Validate that the tariff's validity range falls within the parent contract's range.
// Returns a ValidationError message key if invalid, null if valid.
const validateTemporalNesting = (
  tariffValidFrom: Date,
  tariffValidTo: Date | null | undefined,
  contractValidFrom: Date,
  contractValidTo: Date | null | undefined,
): string | null => {
  if (tariffValidFrom < contractValidFrom) {
    return "validation.tariff.beforeContractStart";
  }
  if (contractValidTo !== null && contractValidTo !== undefined) {
    if (tariffValidFrom >= contractValidTo) {
      return "validation.tariff.afterContractEnd";
    }
    if (tariffValidTo && tariffValidTo > contractValidTo) {
      return "validation.tariff.exceedsContractEnd";
    }
  }
  return null;
};

export const createTariff = async (
  input: TCreateTariffInput,
): Promise<Result<TTariff, TAppError>> => {
  const parsed = createTariffSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const contractId = parsed.data.contractId as TContractId;

  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const { contract } = contractAccess.value;
  const serviceAccess = await serviceByIdForUser(userId, contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    "editor",
  );
  if (!roleGuard.ok) return roleGuard;

  const validFrom = new Date(parsed.data.validFrom);
  const validTo = parsed.data.validTo ? new Date(parsed.data.validTo) : null;
  const rateT1 = parsed.data.rateT1 || null;
  const rateT2 = parsed.data.rateT2 || null;
  const rateT3 = parsed.data.rateT3 || null;
  const fixedAmount = parsed.data.fixedAmount || null;

  // Service-type shape check: tariff shape must match the service's measurement type.
  const shapeError = validateTariffShape(
    serviceAccess.value.serviceType.measurementType,
    rateT1,
    fixedAmount,
  );
  if (shapeError) return err(appError.validation(shapeError));

  // Temporal nesting: tariff validity must fall within the contract's validity range.
  const nestingError = validateTemporalNesting(
    validFrom,
    validTo,
    contract.validFrom,
    contract.validTo,
  );
  if (nestingError) return err(appError.validation(nestingError));

  try {
    const tariff = await db.transaction(async (tx) =>
      insertTariffInternal(tx, {
        contractId,
        rateT1,
        rateT2,
        rateT3,
        fixedAmount,
        validFrom,
        validTo,
        notes: parsed.data.notes || null,
      }),
    );

    revalidatePath(
      `/properties/${serviceAccess.value.service.propertyId}/services/${contract.serviceId}`,
    );
    return ok(tariff);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.overlap"));
    }
    throw error;
  }
};

export const changeTariff = async (
  input: TChangeTariffInput,
): Promise<Result<TTariff, TAppError>> => {
  const parsed = changeTariffSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const contractId = parsed.data.contractId as TContractId;

  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const { contract } = contractAccess.value;
  const serviceAccess = await serviceByIdForUser(userId, contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    "editor",
  );
  if (!roleGuard.ok) return roleGuard;

  // Fetch the current tariff to close.
  const currentResult = await currentTariffForContract(userId, contractId);
  if (!currentResult.ok) return currentResult;
  if (!currentResult.value) {
    return err(appError.validation("validation.tariff.noCurrentTariff"));
  }
  const currentTariff = currentResult.value;

  const changeDate = new Date(parsed.data.changeDate);
  const rateT1 = parsed.data.rateT1 || null;
  const rateT2 = parsed.data.rateT2 || null;
  const rateT3 = parsed.data.rateT3 || null;
  const fixedAmount = parsed.data.fixedAmount || null;

  const shapeError = validateTariffShape(
    serviceAccess.value.serviceType.measurementType,
    rateT1,
    fixedAmount,
  );
  if (shapeError) return err(appError.validation(shapeError));

  // New tariff record must also fall within contract bounds.
  const nestingError = validateTemporalNesting(
    changeDate,
    null,
    contract.validFrom,
    contract.validTo,
  );
  if (nestingError) return err(appError.validation(nestingError));

  try {
    const newTariff = await db.transaction(async (tx) => {
      // Close the current tariff at the change date.
      await tx
        .update(tariffs)
        .set({ validTo: changeDate })
        .where(and(eq(tariffs.id, currentTariff.id), isNull(tariffs.deletedAt)));

      // Open the new tariff from the change date — intervals meet with no gap or overlap.
      return insertTariffInternal(tx, {
        contractId,
        rateT1,
        rateT2,
        rateT3,
        fixedAmount,
        validFrom: changeDate,
        validTo: null,
        notes: parsed.data.notes || null,
      });
    });

    revalidatePath(
      `/properties/${serviceAccess.value.service.propertyId}/services/${contract.serviceId}`,
    );
    return ok(newTariff);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.overlap"));
    }
    throw error;
  }
};

export const updateTariffNotes = async (
  tariffId: TTariffId,
  input: TUpdateTariffNotesInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updateTariffNotesSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const tariffAccess = await tariffByIdForUser(userId, tariffId);
  if (!tariffAccess.ok) return tariffAccess;

  const contractAccess = await contractByIdForUser(userId, tariffAccess.value.contractId);
  if (!contractAccess.ok) return contractAccess;

  const serviceAccess = await serviceByIdForUser(userId, contractAccess.value.contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    "editor",
  );
  if (!roleGuard.ok) return roleGuard;

  await db
    .update(tariffs)
    .set({ notes: parsed.data.notes || null })
    .where(and(eq(tariffs.id, tariffId), isNull(tariffs.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};

export const softDeleteTariff = async (tariffId: TTariffId): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const tariffAccess = await tariffByIdForUser(userId, tariffId);
  if (!tariffAccess.ok) return tariffAccess;

  const contractAccess = await contractByIdForUser(userId, tariffAccess.value.contractId);
  if (!contractAccess.ok) return contractAccess;

  const serviceAccess = await serviceByIdForUser(userId, contractAccess.value.contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    "editor",
  );
  if (!roleGuard.ok) return roleGuard;

  await db
    .update(tariffs)
    .set({ deletedAt: new Date() })
    .where(and(eq(tariffs.id, tariffId), isNull(tariffs.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};
