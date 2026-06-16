import { and, count, inArray, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { services } from "@/lib/db/schema/services";
import type { PropertyId } from "@/lib/db/schema/properties";

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
