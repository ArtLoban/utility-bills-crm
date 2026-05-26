import { and, asc, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId, TServiceType } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { propertyByIdForUser } from "./properties";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// --- Result types ---

export type TMeterGlobalRow = {
  meter: TMeter;
  serviceType: TServiceType;
  property: { id: PropertyId; name: string };
  role: TPropertyRole;
};

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const metersByPropertyId = async (
  userId: UserId,
  propertyId: PropertyId,
): Promise<Result<TMeter[], NotFoundError>> => {
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(meters)
    .where(and(eq(meters.propertyId, propertyId), isNull(meters.deletedAt)))
    .orderBy(asc(meters.serviceTypeId), desc(meters.validFrom));

  return ok(rows);
};

export const currentMeterForServiceType = async (
  userId: UserId,
  propertyId: PropertyId,
  serviceTypeId: TServiceTypeId,
): Promise<Result<TMeter | null, NotFoundError>> => {
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(meters)
    .where(
      and(
        eq(meters.propertyId, propertyId),
        eq(meters.serviceTypeId, serviceTypeId),
        isNull(meters.validTo),
        isNull(meters.deletedAt),
      ),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const meterByIdForUser = async (
  userId: UserId,
  meterId: MeterId,
): Promise<Result<TMeter, NotFoundError>> => {
  const rows = await db
    .select()
    .from(meters)
    .where(and(eq(meters.id, meterId), isNull(meters.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("meter", meterId));

  const meter = rows[0]!;

  // Decision #108: inaccessible meter is indistinguishable from a nonexistent one.
  const access = await propertyByIdForUser(userId, meter.propertyId);
  if (!access.ok) return err(new NotFoundError("meter", meterId));

  return ok(meter);
};

export const metersForGlobalList = async (userId: UserId): Promise<TMeterGlobalRow[]> => {
  const rows = await db
    .select({
      meter: meters,
      serviceType: serviceTypes,
      propertyId: properties.id,
      propertyName: properties.name,
      role: propertyAccess.propertyRole,
    })
    .from(meters)
    .innerJoin(properties, eq(meters.propertyId, properties.id))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, properties.id),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .innerJoin(serviceTypes, eq(meters.serviceTypeId, serviceTypes.id))
    .where(and(isNull(meters.deletedAt), isNull(properties.deletedAt)))
    .orderBy(asc(properties.name), asc(serviceTypes.sortOrder), desc(meters.validFrom));

  return rows.map((r) => ({
    meter: r.meter,
    serviceType: r.serviceType,
    property: { id: r.propertyId, name: r.propertyName },
    role: r.role,
  }));
};
