import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import { contracts } from "@/lib/db/schema/contracts";
import type { TContract } from "@/lib/db/schema/contracts";
import { providers } from "@/lib/db/schema/providers";
import type { TProvider } from "@/lib/db/schema/providers";
import { services } from "@/lib/db/schema/services";
import type { TService, TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// --- Result types ---
// Purpose-named (screen-named), not entity-named. Distinct from the row type TService.
// Nested shape: both TService and TServiceType expose an `id` field — flattening causes collision.
// currentContract: the single active (validTo IS NULL) contract + its provider, if any.

export type TCurrentContractSummary = { contract: TContract; provider: TProvider };

export type TServiceListItem = {
  service: TService;
  serviceType: TServiceType;
  currentContract: TCurrentContractSummary | null;
};

// role: caller's access level on the parent property — needed to gate edit/delete controls.
// currentTariff / currentAccountNumber / currentPaymentDetails: the single active records, if any.
export type TServiceDetail = {
  service: TService;
  serviceType: TServiceType;
  role: TPropertyRole;
  currentContract: TCurrentContractSummary | null;
  currentTariff: TTariff | null;
  currentAccountNumber: TAccountNumber | null;
  currentPaymentDetails: TPaymentDetails | null;
};

// --- Queries ---
// Pure functions: userId is always a parameter. Never read the auth session internally.
// Access is derived through the parent property — both queries route through
// propertyByIdForUser (Stage 2 helper) rather than duplicating access logic.

export const servicesByPropertyId = async (
  userId: UserId,
  propertyId: PropertyId,
): Promise<Result<TServiceListItem[], NotFoundError>> => {
  // Stage 2 access helper: returns NotFoundError for missing OR inaccessible property.
  // 404-masking per decision #108 — no access ≡ nonexistent.
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select({
      service: services,
      serviceType: serviceTypes,
      contract: contracts,
      provider: providers,
    })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    // LEFT JOIN: current (validTo IS NULL) non-deleted contract for each service, if any.
    .leftJoin(
      contracts,
      and(
        eq(contracts.serviceId, services.id),
        isNull(contracts.validTo),
        isNull(contracts.deletedAt),
      ),
    )
    .leftJoin(providers, eq(contracts.providerId, providers.id))
    .where(and(eq(services.propertyId, propertyId), isNull(services.deletedAt)));

  return ok(
    rows.map((row) => ({
      service: row.service,
      serviceType: row.serviceType,
      // provider! is safe: FK RESTRICT guarantees a non-soft-deleted provider exists
      // whenever a non-soft-deleted contract references it.
      currentContract: row.contract ? { contract: row.contract, provider: row.provider! } : null,
    })),
  );
};

export const serviceByIdForUser = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<Result<TServiceDetail, NotFoundError>> => {
  // Fetch first, then check access — avoids duplicating the propertyAccess JOIN logic.
  const rows = await db
    .select({
      service: services,
      serviceType: serviceTypes,
      contract: contracts,
      provider: providers,
      tariff: tariffs,
      accountNumber: accountNumbers,
      paymentDetail: paymentDetails,
    })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .leftJoin(
      contracts,
      and(
        eq(contracts.serviceId, services.id),
        isNull(contracts.validTo),
        isNull(contracts.deletedAt),
      ),
    )
    .leftJoin(providers, eq(contracts.providerId, providers.id))
    // Current temporal attributes — only join when a contract exists (NULL contract_id never matches).
    .leftJoin(
      tariffs,
      and(eq(tariffs.contractId, contracts.id), isNull(tariffs.validTo), isNull(tariffs.deletedAt)),
    )
    .leftJoin(
      accountNumbers,
      and(
        eq(accountNumbers.contractId, contracts.id),
        isNull(accountNumbers.validTo),
        isNull(accountNumbers.deletedAt),
      ),
    )
    .leftJoin(
      paymentDetails,
      and(
        eq(paymentDetails.contractId, contracts.id),
        isNull(paymentDetails.validTo),
        isNull(paymentDetails.deletedAt),
      ),
    )
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("service", serviceId));

  const row = rows[0]!;

  // Access check via Stage 2 helper. A service under an inaccessible property must be
  // indistinguishable from a nonexistent one — surface as NotFoundError, not ForbiddenError.
  const access = await propertyByIdForUser(userId, row.service.propertyId);
  if (!access.ok) return err(new NotFoundError("service", serviceId));

  return ok({
    service: row.service,
    serviceType: row.serviceType,
    role: access.value.role,
    // provider! is safe: FK RESTRICT guarantees a non-soft-deleted provider exists
    // whenever a non-soft-deleted contract references it.
    currentContract: row.contract ? { contract: row.contract, provider: row.provider! } : null,
    currentTariff: row.tariff ?? null,
    currentAccountNumber: row.accountNumber ?? null,
    currentPaymentDetails: row.paymentDetail ?? null,
  });
};
