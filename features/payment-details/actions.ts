"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { TPaymentDetails, TPaymentDetailsId } from "@/lib/db/schema/payment-details";
import type { TContractId } from "@/lib/db/schema/contracts";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import {
  paymentDetailsByIdForUser,
  currentPaymentDetailsForContract,
} from "@/lib/db/access/payment-details";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { insertPaymentDetailsInternal } from "./lib";
import {
  changePaymentDetailsSchema,
  createPaymentDetailsSchema,
  updatePaymentDetailsNotesSchema,
} from "./schema";
import type {
  TChangePaymentDetailsInput,
  TCreatePaymentDetailsInput,
  TUpdatePaymentDetailsNotesInput,
} from "./schema";

const isExclusionViolation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "23P01";

const validateTemporalNesting = (
  validFrom: Date,
  validTo: Date | null | undefined,
  contractValidFrom: Date,
  contractValidTo: Date | null | undefined,
): string | null => {
  if (validFrom < contractValidFrom) return "validation.paymentDetails.beforeContractStart";
  if (contractValidTo !== null && contractValidTo !== undefined) {
    if (validFrom >= contractValidTo) return "validation.paymentDetails.afterContractEnd";
    if (validTo && validTo > contractValidTo) return "validation.paymentDetails.exceedsContractEnd";
  }
  return null;
};

export const createPaymentDetails = async (
  input: TCreatePaymentDetailsInput,
): Promise<Result<TPaymentDetails, TAppError>> => {
  const parsed = createPaymentDetailsSchema.safeParse(input);
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

  const nestingError = validateTemporalNesting(
    validFrom,
    validTo,
    contract.validFrom,
    contract.validTo,
  );
  if (nestingError) return err(appError.validation(nestingError));

  try {
    const record = await db.transaction(async (tx) =>
      insertPaymentDetailsInternal(tx, {
        contractId,
        details: parsed.data.details,
        validFrom,
        validTo,
        notes: parsed.data.notes || null,
      }),
    );

    revalidatePath(
      `/properties/${serviceAccess.value.service.propertyId}/services/${contract.serviceId}`,
    );
    return ok(record);
  } catch (error) {
    if (isExclusionViolation(error)) return err(appError.validation("validation.overlap"));
    throw error;
  }
};

export const changePaymentDetails = async (
  input: TChangePaymentDetailsInput,
): Promise<Result<TPaymentDetails, TAppError>> => {
  const parsed = changePaymentDetailsSchema.safeParse(input);
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

  const currentResult = await currentPaymentDetailsForContract(userId, contractId);
  if (!currentResult.ok) return currentResult;
  if (!currentResult.value) {
    return err(appError.validation("validation.paymentDetails.noCurrent"));
  }
  const current = currentResult.value;

  const changeDate = new Date(parsed.data.changeDate);

  const nestingError = validateTemporalNesting(
    changeDate,
    null,
    contract.validFrom,
    contract.validTo,
  );
  if (nestingError) return err(appError.validation(nestingError));

  try {
    const newRecord = await db.transaction(async (tx) => {
      await tx
        .update(paymentDetails)
        .set({ validTo: changeDate })
        .where(and(eq(paymentDetails.id, current.id), isNull(paymentDetails.deletedAt)));

      return insertPaymentDetailsInternal(tx, {
        contractId,
        details: parsed.data.details,
        validFrom: changeDate,
        validTo: null,
        notes: parsed.data.notes || null,
      });
    });

    revalidatePath(
      `/properties/${serviceAccess.value.service.propertyId}/services/${contract.serviceId}`,
    );
    return ok(newRecord);
  } catch (error) {
    if (isExclusionViolation(error)) return err(appError.validation("validation.overlap"));
    throw error;
  }
};

export const updatePaymentDetailsNotes = async (
  paymentDetailsId: TPaymentDetailsId,
  input: TUpdatePaymentDetailsNotesInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updatePaymentDetailsNotesSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentDetailsByIdForUser(userId, paymentDetailsId);
  if (!access.ok) return access;

  const contractAccess = await contractByIdForUser(userId, access.value.contractId);
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
    .update(paymentDetails)
    .set({ notes: parsed.data.notes || null })
    .where(and(eq(paymentDetails.id, paymentDetailsId), isNull(paymentDetails.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};

export const softDeletePaymentDetails = async (
  paymentDetailsId: TPaymentDetailsId,
): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentDetailsByIdForUser(userId, paymentDetailsId);
  if (!access.ok) return access;

  const contractAccess = await contractByIdForUser(userId, access.value.contractId);
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
    .update(paymentDetails)
    .set({ deletedAt: new Date() })
    .where(and(eq(paymentDetails.id, paymentDetailsId), isNull(paymentDetails.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};
