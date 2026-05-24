import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TService, TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// --- Result types ---
// Purpose-named (screen-named), not entity-named. Distinct from the row type TService.
// Nested shape: both TService and TServiceType expose an `id` field — flattening causes collision.
// Same shape today; they will diverge independently when later stages add JOINs (contracts,
// readings, balance).

export type TServiceListItem = { service: TService; serviceType: TServiceType };
export type TServiceDetail = { service: TService; serviceType: TServiceType };

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
    .select({ service: services, serviceType: serviceTypes })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(eq(services.propertyId, propertyId), isNull(services.deletedAt)));

  return ok(rows);
};

export const serviceByIdForUser = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<Result<TServiceDetail, NotFoundError>> => {
  // Fetch first, then check access — avoids duplicating the propertyAccess JOIN logic.
  const rows = await db
    .select({ service: services, serviceType: serviceTypes })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("service", serviceId));

  const row = rows[0]!;

  // Access check via Stage 2 helper. A service under an inaccessible property must be
  // indistinguishable from a nonexistent one — surface as NotFoundError, not ForbiddenError.
  const access = await propertyByIdForUser(userId, row.service.propertyId);
  if (!access.ok) return err(new NotFoundError("service", serviceId));

  return ok(row);
};
