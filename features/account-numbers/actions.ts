"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import type { TAccountNumber, TAccountNumberId } from "@/lib/db/schema/account-numbers";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { UserId } from "@/lib/db/schema/auth";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import {
  accountNumberByIdForUser,
  currentAccountNumberForContract,
} from "@/lib/db/access/account-numbers";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { insertAccountNumberInternal } from "./lib";
import {
  changeAccountNumberSchema,
  createAccountNumberSchema,
  updateAccountNumberNotesSchema,
} from "./schema";
import type {
  TChangeAccountNumberInput,
  TCreateAccountNumberInput,
  TUpdateAccountNumberNotesInput,
} from "./schema";

const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

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
  if (validFrom < contractValidFrom) return "validation.accountNumber.beforeContractStart";
  if (contractValidTo !== null && contractValidTo !== undefined) {
    if (validFrom >= contractValidTo) return "validation.accountNumber.afterContractEnd";
    if (validTo && validTo > contractValidTo) return "validation.accountNumber.exceedsContractEnd";
  }
  return null;
};

export const createAccountNumber = async (
  input: TCreateAccountNumberInput,
): Promise<Result<TAccountNumber, ValidationError | NotFoundError>> => {
  const parsed = createAccountNumberSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();
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
  if (nestingError) return err(new ValidationError(nestingError));

  try {
    const record = await db.transaction(async (tx) =>
      insertAccountNumberInternal(tx, {
        contractId,
        value: parsed.data.value,
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
    if (isExclusionViolation(error)) return err(new ValidationError("validation.overlap"));
    throw error;
  }
};

export const changeAccountNumber = async (
  input: TChangeAccountNumberInput,
): Promise<Result<TAccountNumber, ValidationError | NotFoundError>> => {
  const parsed = changeAccountNumberSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();
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

  const currentResult = await currentAccountNumberForContract(userId, contractId);
  if (!currentResult.ok) return currentResult;
  if (!currentResult.value) {
    return err(new ValidationError("validation.accountNumber.noCurrent"));
  }
  const current = currentResult.value;

  const changeDate = new Date(parsed.data.changeDate);

  const nestingError = validateTemporalNesting(
    changeDate,
    null,
    contract.validFrom,
    contract.validTo,
  );
  if (nestingError) return err(new ValidationError(nestingError));

  try {
    const newRecord = await db.transaction(async (tx) => {
      await tx
        .update(accountNumbers)
        .set({ validTo: changeDate })
        .where(and(eq(accountNumbers.id, current.id), isNull(accountNumbers.deletedAt)));

      return insertAccountNumberInternal(tx, {
        contractId,
        value: parsed.data.value,
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
    if (isExclusionViolation(error)) return err(new ValidationError("validation.overlap"));
    throw error;
  }
};

export const updateAccountNumberNotes = async (
  accountNumberId: TAccountNumberId,
  input: TUpdateAccountNumberNotesInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = updateAccountNumberNotesSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();

  const access = await accountNumberByIdForUser(userId, accountNumberId);
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
    .update(accountNumbers)
    .set({ notes: parsed.data.notes || null })
    .where(and(eq(accountNumbers.id, accountNumberId), isNull(accountNumbers.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};

export const softDeleteAccountNumber = async (
  accountNumberId: TAccountNumberId,
): Promise<Result<void, NotFoundError>> => {
  const userId = await requireAuth();

  const access = await accountNumberByIdForUser(userId, accountNumberId);
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
    .update(accountNumbers)
    .set({ deletedAt: new Date() })
    .where(and(eq(accountNumbers.id, accountNumberId), isNull(accountNumbers.deletedAt)));

  revalidatePath(
    `/properties/${serviceAccess.value.service.propertyId}/services/${contractAccess.value.contract.serviceId}`,
  );
  return ok(undefined);
};
