import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { contracts } from "@/lib/db/schema/contracts";
import type { TContract, TContractId } from "@/lib/db/schema/contracts";
import { providers } from "@/lib/db/schema/providers";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";
import type { UserId } from "@/lib/db/schema/auth";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Pure functions: userId is always a parameter. Never read the auth session internally.
// Access is derived through the parent service → property chain.

export type TContractWithProvider = { contract: TContract; provider: TProvider };

export const contractsByServiceId = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<Result<TContractWithProvider[], NotFoundError>> => {
  // Access check via parent service — propagates NotFoundError for missing or inaccessible.
  const serviceAccess = await serviceByIdForUser(userId, serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const rows = await db
    .select({ contract: contracts, provider: providers })
    .from(contracts)
    .innerJoin(providers, eq(contracts.providerId, providers.id))
    .where(and(eq(contracts.serviceId, serviceId), isNull(contracts.deletedAt)))
    .orderBy(desc(contracts.validFrom));

  return ok(rows);
};

export const currentContractForService = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<Result<TContractWithProvider | null, NotFoundError>> => {
  const serviceAccess = await serviceByIdForUser(userId, serviceId);
  if (!serviceAccess.ok) return serviceAccess;

  const rows = await db
    .select({ contract: contracts, provider: providers })
    .from(contracts)
    .innerJoin(providers, eq(contracts.providerId, providers.id))
    .where(
      and(
        eq(contracts.serviceId, serviceId),
        isNull(contracts.validTo),
        isNull(contracts.deletedAt),
      ),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const contractByIdForUser = async (
  userId: UserId,
  contractId: TContractId,
): Promise<Result<TContractWithProvider, NotFoundError>> => {
  // Fetch first, then verify access through parent service.
  const rows = await db
    .select({ contract: contracts, provider: providers })
    .from(contracts)
    .innerJoin(providers, eq(contracts.providerId, providers.id))
    .where(and(eq(contracts.id, contractId), isNull(contracts.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("contract", contractId));

  const row = rows[0]!;

  // Decision #108: inaccessible contract must be indistinguishable from a nonexistent one.
  const serviceAccess = await serviceByIdForUser(userId, row.contract.serviceId);
  if (!serviceAccess.ok) return err(new NotFoundError("contract", contractId));

  return ok(row);
};
