import { and, eq, exists, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { meters } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
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
// Anchored on meters (one row per meter): the meter's service type must be metered and the meter
// must feed at least one non-deleted service via an explicit meter_services link (Slice B3 — no
// longer "same service type on the property"). As an EXISTS semi-join it keeps one row per meter,
// so several services sharing a meter never fan the alert out.
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
            .from(meterServices)
            .innerJoin(
              services,
              and(eq(services.id, meterServices.serviceId), isNull(services.deletedAt)),
            )
            .where(and(eq(meterServices.meterId, meters.id), isNull(meterServices.deletedAt))),
        ),
      ),
    );

  return rows.map((r) => ({
    meterId: r.meterId,
    serviceTypeCode: r.serviceTypeCode,
    propertyName: r.propertyName,
  }));
};
