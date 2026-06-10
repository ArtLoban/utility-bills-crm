import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { meters } from "@/lib/db/schema/meters";
import { readings } from "@/lib/db/schema/readings";
import type { UserId } from "@/lib/db/schema/auth";

export type TMissingReading = {
  serviceId: TServiceId;
  serviceTypeCode: string;
  propertyName: string;
};

// Returns metered services accessible to the user that have an active meter (validTo IS NULL)
// but no reading for the current calendar month.
// "Active meter" = validTo IS NULL AND deletedAt IS NULL.
// "Current month" = calendar month of now() at query-execution time (UTC).
// Anti-join pattern: LEFT JOIN readings on current-month condition, keep rows where no match.
export const missingCurrentMonthReadings = async (userId: UserId): Promise<TMissingReading[]> => {
  const rows = await db
    .select({
      serviceId: services.id,
      serviceTypeCode: serviceTypes.code,
      propertyName: properties.name,
    })
    .from(propertyAccess)
    .innerJoin(
      properties,
      and(eq(propertyAccess.propertyId, properties.id), isNull(properties.deletedAt)),
    )
    .innerJoin(services, and(eq(services.propertyId, properties.id), isNull(services.deletedAt)))
    .innerJoin(
      serviceTypes,
      and(eq(services.serviceTypeId, serviceTypes.id), eq(serviceTypes.measurementType, "metered")),
    )
    .innerJoin(
      meters,
      and(
        eq(meters.propertyId, properties.id),
        eq(meters.serviceTypeId, services.serviceTypeId),
        isNull(meters.validTo),
        isNull(meters.deletedAt),
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
      and(eq(propertyAccess.userId, userId), isNull(propertyAccess.deletedAt), isNull(readings.id)),
    );

  return rows.map((r) => ({
    serviceId: r.serviceId,
    serviceTypeCode: r.serviceTypeCode,
    propertyName: r.propertyName,
  }));
};
