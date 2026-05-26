import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { meters } from "@/lib/db/schema/meters";
import type { TMeter } from "@/lib/db/schema/meters";
import { properties } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { services } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { propertyByIdForUser } from "@/lib/db/access/properties";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export type TPropertyMeterRow = {
  meter: TMeter;
  serviceType: TServiceType;
};

const resolveUserId = async (propertyId: PropertyId): Promise<UserId | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id as UserId;
};

export const getPropertyMeters = async (
  propertyId: PropertyId,
): Promise<Result<TPropertyMeterRow[], NotFoundError>> => {
  const userId = await resolveUserId(propertyId);
  if (!userId) return err(new NotFoundError("property", propertyId));

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

// Service types where the property has a service but no active meter yet.
// Used to populate the service type dropdown in the Add Meter modal.
export const getAvailableServiceTypesForMeter = async (
  propertyId: PropertyId,
): Promise<TServiceType[]> => {
  const userId = await resolveUserId(propertyId);
  if (!userId) return [];

  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return [];

  // All service types this property has a service for.
  const withService = await db
    .select({ serviceType: serviceTypes })
    .from(services)
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(eq(services.propertyId, propertyId), isNull(services.deletedAt)));

  if (withService.length === 0) return [];

  // Active meters already covering some service types.
  const activeMeterRows = await db
    .select({ serviceTypeId: meters.serviceTypeId })
    .from(meters)
    .where(
      and(eq(meters.propertyId, propertyId), isNull(meters.validTo), isNull(meters.deletedAt)),
    );

  const coveredIds = new Set(activeMeterRows.map((r) => r.serviceTypeId));

  return withService.map((r) => r.serviceType).filter((st) => !coveredIds.has(st.id));
};
