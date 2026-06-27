"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { contracts } from "@/lib/db/schema/contracts";
import type { TContract, TContractId } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { ProviderId } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";
import { contractByIdForUser, currentContractForService } from "@/lib/db/access/contracts";
import { providerByIdForUser } from "@/lib/db/access/providers";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { insertContractInternal } from "./lib";
import { changeProviderSchema, createContractSchema, updateContractNotesSchema } from "./schema";
import type {
  TChangeProviderInput,
  TCreateContractInput,
  TUpdateContractNotesInput,
} from "./schema";

// PostgreSQL error code 23P01 = exclusion_violation.
const isExclusionViolation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "23P01";

export const createContract = async (
  input: TCreateContractInput,
): Promise<Result<TContract, TAppError>> => {
  const parsed = createContractSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const serviceId = parsed.data.serviceId as TServiceId;
  const providerId = parsed.data.providerId as ProviderId;

  // Verify service is accessible and get propertyId for role check.
  const serviceAccess = await serviceByIdForUser(userId, serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const propertyId = serviceAccess.value.service.propertyId;
  const roleGuard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  // Validate that the provider belongs to the current user (prevents cross-user leakage).
  const providerGuard = await providerByIdForUser(userId, providerId);
  if (!providerGuard.ok) return providerGuard;

  const validFrom = new Date(parsed.data.validFrom);

  try {
    const contract = await db.transaction(async (tx) =>
      insertContractInternal(tx, {
        serviceId,
        providerId,
        validFrom,
        notes: parsed.data.notes || null,
      }),
    );

    revalidatePath(`/properties/${propertyId}/services/${serviceId}`);
    return ok(contract);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.overlap"));
    }
    throw error;
  }
};

export const closeContract = async (
  contractId: TContractId,
  validTo: Date,
): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const { contract } = contractAccess.value;
  const serviceAccess = await serviceByIdForUser(userId, contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  if (validTo <= contract.validFrom) {
    return err(appError.validation("End date must be after the contract's start date"));
  }

  await db
    .update(contracts)
    .set({ validTo })
    .where(and(eq(contracts.id, contractId), isNull(contracts.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contract.serviceId}`,
  );
  return ok(undefined);
};

export const changeProvider = async (
  input: TChangeProviderInput,
): Promise<Result<TContract, TAppError>> => {
  const parsed = changeProviderSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const serviceId = parsed.data.serviceId as TServiceId;
  const newProviderId = parsed.data.newProviderId as ProviderId;
  const changeDate = new Date(parsed.data.changeDate);

  const serviceAccess = await serviceByIdForUser(userId, serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const propertyId = serviceAccess.value.service.propertyId;
  const roleGuard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  // Validate that the new provider belongs to the current user.
  const providerGuard = await providerByIdForUser(userId, newProviderId);
  if (!providerGuard.ok) return providerGuard;

  // The current contract must exist — "change provider" implies there is something to change.
  const currentContractResult = await currentContractForService(userId, serviceId);
  if (!currentContractResult.ok) return currentContractResult;
  if (!currentContractResult.value) {
    return err(appError.notFound("contract"));
  }

  const currentContract = currentContractResult.value.contract;

  if (changeDate <= currentContract.validFrom) {
    return err(appError.validation("Change date must be after the current contract's start date"));
  }

  try {
    const newContract = await db.transaction(async (tx) => {
      // Close the current contract at changeDate.
      await tx
        .update(contracts)
        .set({ validTo: changeDate })
        .where(and(eq(contracts.id, currentContract.id), isNull(contracts.deletedAt)));

      // Open the new contract starting at the same instant — half-open intervals meet without gap.
      return insertContractInternal(tx, {
        serviceId,
        providerId: newProviderId,
        validFrom: changeDate,
        notes: parsed.data.notes || null,
      });
    });

    revalidatePath(`/properties/${propertyId}/services/${serviceId}`);
    return ok(newContract);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(
        appError.validation(
          "An active contract for this service already exists in the selected period",
        ),
      );
    }
    throw error;
  }
};

export const updateContractNotes = async (
  contractId: TContractId,
  input: TUpdateContractNotesInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updateContractNotesSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const serviceAccess = await serviceByIdForUser(userId, contractAccess.value.contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  await db
    .update(contracts)
    .set({ notes: parsed.data.notes || null })
    .where(and(eq(contracts.id, contractAccess.value.contract.id), isNull(contracts.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};

export const softDeleteContract = async (
  contractId: TContractId,
): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const serviceAccess = await serviceByIdForUser(userId, contractAccess.value.contract.serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    serviceAccess.value.service.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  const now = new Date();

  await db.transaction(async (tx) => {
    // Soft-delete cascade for contract children — add each new entity here as introduced.
    // tariffs ↓
    await tx
      .update(tariffs)
      .set({ deletedAt: now })
      .where(and(eq(tariffs.contractId, contractId), isNull(tariffs.deletedAt)));
    // account_numbers ↓
    await tx
      .update(accountNumbers)
      .set({ deletedAt: now })
      .where(and(eq(accountNumbers.contractId, contractId), isNull(accountNumbers.deletedAt)));
    // payment_details ↓
    await tx
      .update(paymentDetails)
      .set({ deletedAt: now })
      .where(and(eq(paymentDetails.contractId, contractId), isNull(paymentDetails.deletedAt)));

    await tx
      .update(contracts)
      .set({ deletedAt: now })
      .where(and(eq(contracts.id, contractId), isNull(contracts.deletedAt)));
  });

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};
