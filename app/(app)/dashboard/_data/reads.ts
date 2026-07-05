import { and, eq, exists, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import { readings } from "@/lib/db/schema/readings";
import type { UserId } from "@/lib/db/schema/auth";

export type TMissingReading = {
  meterId: MeterId;
  serviceTypeCode: string;
  propertyName: string;
};

// TODO: remember - comments lie!
// Returns active metered meters accessible to the user that lack a reading for the current
// calendar month — the units of a "missing reading" alert, since a reading is recorded against
// a meter (bound to property + service type), not against a single service.
// Anchored on meters (one row per meter): the meter's service type must be metered and still have
// at least one active service on the property. This EXISTS semi-join replaces a plain services
// join so multiple services of the same type on a property no longer fan the row out (a property
// may now hold several active services per type — see services schema / migration 0024).
// "Active meter" = validTo IS NULL AND deletedAt IS NULL.
// "Current month" = calendar month of now() at query-execution time (UTC).
// Anti-join pattern: LEFT JOIN readings on current-month condition, keep rows where no match.
export const missingCurrentMonthReadings = async (userId: UserId): Promise<TMissingReading[]> => {
  const rows = await db
    .select({
      meterId: meters.id,
      serviceTypeCode: serviceTypes.code,
      propertyName: properties.name,
    })
    .from(meters)
    .innerJoin(
      serviceTypes,
      and(eq(serviceTypes.id, meters.serviceTypeId), eq(serviceTypes.measurementType, "metered")),
    )
    .innerJoin(properties, and(eq(properties.id, meters.propertyId), isNull(properties.deletedAt)))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, meters.propertyId),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .leftJoin(
      readings,
      and(
        eq(readings.meterId, meters.id),
        isNull(readings.deletedAt),
        sql`date_trunc('month', ${readings.readAt}) = date_trunc('month', now())`,
      ),
    )
    .where(
      and(
        isNull(meters.validTo),
        isNull(meters.deletedAt),
        isNull(readings.id),
        exists(
          db
            .select({ one: sql`1` })
            .from(services)
            .where(
              and(
                eq(services.propertyId, meters.propertyId),
                eq(services.serviceTypeId, meters.serviceTypeId),
                isNull(services.deletedAt),
              ),
            ),
        ),
      ),
    );

  return rows.map((r) => ({
    meterId: r.meterId,
    serviceTypeCode: r.serviceTypeCode,
    propertyName: r.propertyName,
  }));
};
