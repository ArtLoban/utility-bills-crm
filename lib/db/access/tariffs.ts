import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { contractByIdForUser } from "@/lib/db/access/contracts";
import type { TContractId } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff, TTariffId } from "@/lib/db/schema/tariffs";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Pure functions: userId is always a parameter. Never read the auth session internally.
// Access is derived through the parent contract → service → property chain.

export const tariffsByContractId = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TTariff[], NotFoundError>> => {
  // Access check via parent contract — propagates NotFoundError for missing or inaccessible.
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(tariffs)
    .where(and(eq(tariffs.contractId, contractId), isNull(tariffs.deletedAt)))
    .orderBy(asc(tariffs.validFrom));

  return ok(rows);
};

export const currentTariffForContract = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TTariff | null, NotFoundError>> => {
  const contractAccess = await contractByIdForUser(userId, contractId);
  if (!contractAccess.ok) return contractAccess;

  const rows = await db
    .select()
    .from(tariffs)
    .where(
      and(eq(tariffs.contractId, contractId), isNull(tariffs.validTo), isNull(tariffs.deletedAt)),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const tariffByIdForUser = async (
  userId: UserId,
  tariffId: TTariffId,
): Promise<Result<TTariff, NotFoundError>> => {
  const rows = await db
    .select()
    .from(tariffs)
    .where(and(eq(tariffs.id, tariffId), isNull(tariffs.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("tariff", tariffId));

  const tariff = rows[0]!;

  // Decision #108: inaccessible tariff must be indistinguishable from a nonexistent one.
  const contractAccess = await contractByIdForUser(userId, tariff.contractId);
  if (!contractAccess.ok) return err(new NotFoundError("tariff", tariffId));

  return ok(tariff);
};
