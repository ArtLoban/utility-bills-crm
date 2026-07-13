import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { meters } from "@/lib/db/schema/meters";
import type { TMeter } from "@/lib/db/schema/meters";
import type { PropertyId } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { services } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import { NotFoundError, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import type { TEligibleMeterService } from "@/features/meters/types";

export type TPropertyMeterRow = {
  meter: TMeter;
  serviceType: TServiceType;
};

export const getPropertyMeters = async (
  propertyId: PropertyId,
): Promise<Result<TPropertyMeterRow[], TAppError>> => {
  const userId = await requireUser();

  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select({ meter: meters, serviceType: serviceTypes })
    .from(meters)
    .innerJoin(serviceTypes, eq(meters.serviceTypeId, serviceTypes.id))
    .where(and(eq(meters.propertyId, propertyId), isNull(meters.deletedAt)))
    .orderBy(serviceTypes.sortOrder, meters.validFrom);

  return ok(rows);
};

// Metered service types the property has at least one service for — the types a new meter may
// carry. As of Slice B2 this no longer excludes types that already have an active meter: multiple
// active meters of one type are allowed, so a second meter of an existing type must be creatable.
export const getAvailableServiceTypesForMeter = async (
  propertyId: PropertyId,
): Promise<TServiceType[]> => {
  const userId = await requireUser();

  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return [];

  const rows = await db
    .selectDistinct({ serviceType: serviceTypes })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(
      and(
        eq(services.propertyId, propertyId),
        eq(serviceTypes.measurementType, "metered"),
        isNull(services.deletedAt),
      ),
    )
    .orderBy(serviceTypes.sortOrder);

  return rows.map((r) => r.serviceType);
};

// The specific metered service lines a new meter may feed (Slice B2). The Add Meter form filters
// these by the chosen service type; a meter's linked services must share its type.
export const getEligibleServicesForMeter = async (
  propertyId: PropertyId,
): Promise<TEligibleMeterService[]> => {
  const userId = await requireUser();

  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return [];

  return db
    .select({
      id: services.id,
      serviceTypeId: services.serviceTypeId,
      code: serviceTypes.code,
      name: services.name,
    })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(
      and(
        eq(services.propertyId, propertyId),
        eq(serviceTypes.measurementType, "metered"),
        isNull(services.deletedAt),
      ),
    )
    .orderBy(serviceTypes.sortOrder, services.createdAt);
};
