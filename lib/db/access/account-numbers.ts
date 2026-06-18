import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import type { TContractId } from "@/lib/db/schema/contracts";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import type { TAccountNumber, TAccountNumberId } from "@/lib/db/schema/account-numbers";
import type { UserId } from "@/lib/db/schema/auth";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

// Pure functions: userId is always a parameter. Never read the auth session internally.
// Access is derived through the parent contract → service → property chain.

export const accountNumbersByContractId = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TAccountNumber[], TAppError>> => {
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(accountNumbers)
    .where(and(eq(accountNumbers.contractId, contractId), isNull(accountNumbers.deletedAt)))
    .orderBy(asc(accountNumbers.validFrom));

  return ok(rows);
};

export const currentAccountNumberForContract = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TAccountNumber | null, TAppError>> => {
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(accountNumbers)
    .where(
      and(
        eq(accountNumbers.contractId, contractId),
        isNull(accountNumbers.validTo),
        isNull(accountNumbers.deletedAt),
      ),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const accountNumberByIdForUser = async (
  userId: UserId,
  accountNumberId: TAccountNumberId,
): Promise<Result<TAccountNumber, TAppError>> => {
  const rows = await db
    .select()
    .from(accountNumbers)
    .where(and(eq(accountNumbers.id, accountNumberId), isNull(accountNumbers.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(appError.notFound("accountNumber", accountNumberId));

  const accountNumber = rows[0]!;

  // Decision #108: inaccessible record must be indistinguishable from a nonexistent one.
  const contractAccess = await contractByIdForUser(userId, accountNumber.contractId);
  if (!contractAccess.ok) return err(appError.notFound("accountNumber", accountNumberId));

  return ok(accountNumber);
};
