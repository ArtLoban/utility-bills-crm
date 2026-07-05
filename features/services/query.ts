import { and, asc, count, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { services } from "@/lib/db/schema/services";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import type { TServiceTypeCode } from "./service-type";

// Returns the active-service count for a batch of properties in one grouped query (no N+1).
// No access check — only called with propertyIds the caller has already access-scoped
// (e.g. via accessibleProperties). Same pattern as balancesForServices in features/ledger.
export const serviceCountsForProperties = async (
  propertyIds: PropertyId[],
): Promise<Map<PropertyId, number>> => {
  if (propertyIds.length === 0) return new Map();

  const rows = await db
    .select({ propertyId: services.propertyId, total: count() })
    .from(services)
    .where(and(inArray(services.propertyId, propertyIds), isNull(services.deletedAt)))
    .groupBy(services.propertyId);

  return new Map(rows.map((r) => [r.propertyId, r.total]));
};

// Distinct service-type codes across a user's configured (non-deleted) services, in catalog
// order (service_types.sortOrder). Access-scoped via propertyAccess; optionally narrowed to
// one property. Deliberately independent of any date range or selected service-type — this
// is the stable source for the dashboard's Service filter options, so picking a service
// never collapses the option list. Custom `other` services all share code "other" → one entry.
export const serviceTypeCodesForUser = async (
  userId: UserId,
  params?: { propertyId?: string | null },
): Promise<TServiceTypeCode[]> => {
  const propertyId = params?.propertyId;

  const rows = await db
    .selectDistinct({ code: serviceTypes.code, sortOrder: serviceTypes.sortOrder })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .innerJoin(properties, eq(services.propertyId, properties.id))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, properties.id),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .where(
      and(
        isNull(services.deletedAt),
        isNull(properties.deletedAt),
        propertyId ? eq(properties.id, propertyId as PropertyId) : undefined,
      ),
    )
    .orderBy(asc(serviceTypes.sortOrder));

  return rows.map((r) => r.code as TServiceTypeCode);
};
