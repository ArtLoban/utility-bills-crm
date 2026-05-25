import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import type { TContractId } from "@/lib/db/schema/contracts";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { TPaymentDetails, TPaymentDetailsId } from "@/lib/db/schema/payment-details";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Pure functions: userId is always a parameter. Never read the auth session internally.
// Access is derived through the parent contract → service → property chain.

export const paymentDetailsByContractId = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TPaymentDetails[], NotFoundError>> => {
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(paymentDetails)
    .where(and(eq(paymentDetails.contractId, contractId), isNull(paymentDetails.deletedAt)))
    .orderBy(asc(paymentDetails.validFrom));

  return ok(rows);
};

export const currentPaymentDetailsForContract = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TPaymentDetails | null, NotFoundError>> => {
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(paymentDetails)
    .where(
      and(
        eq(paymentDetails.contractId, contractId),
        isNull(paymentDetails.validTo),
        isNull(paymentDetails.deletedAt),
      ),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const paymentDetailsByIdForUser = async (
  userId: UserId,
  paymentDetailsId: TPaymentDetailsId,
): Promise<Result<TPaymentDetails, NotFoundError>> => {
  const rows = await db
    .select()
    .from(paymentDetails)
    .where(and(eq(paymentDetails.id, paymentDetailsId), isNull(paymentDetails.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("paymentDetails", paymentDetailsId));

  const record = rows[0]!;

  // Decision #108: inaccessible record must be indistinguishable from a nonexistent one.
  const contractAccess = await contractByIdForUser(userId, record.contractId);
  if (!contractAccess.ok) return err(new NotFoundError("paymentDetails", paymentDetailsId));

  return ok(record);
};
