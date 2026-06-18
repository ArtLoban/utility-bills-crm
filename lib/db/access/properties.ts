import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TProperty, TPropertyRole } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

// --- Role ordering ---
// owner > editor > viewer. Used by requirePropertyRole to check "at least X" conditions.

export const ROLE_RANK: Record<TPropertyRole, number> = {
  owner: 3,
  editor: 2,
  viewer: 1,
};

export const roleAtLeast = (actual: TPropertyRole, min: TPropertyRole): boolean =>
  ROLE_RANK[actual] >= ROLE_RANK[min];

// --- Internal shape ---
// Nested, not flattened: future additions (serviceCount, balance) sit cleanly
// alongside `role` without mixing into TProperty's own fields.

type TPropertyWithRole = { property: TProperty; role: TPropertyRole };

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.
// All helpers filter deletedAt IS NULL on both properties and property_access.

export const accessibleProperties = (userId: UserId): Promise<TPropertyWithRole[]> =>
  db
    .select({ property: properties, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .innerJoin(properties, eq(propertyAccess.propertyId, properties.id))
    .where(
      and(
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
        isNull(properties.deletedAt),
      ),
    );

export const propertyByIdForUser = async (
  userId: UserId,
  propertyId: PropertyId,
): Promise<Result<TPropertyWithRole, TAppError>> => {
  const rows = await db
    .select({ property: properties, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .innerJoin(properties, eq(propertyAccess.propertyId, properties.id))
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
        isNull(properties.deletedAt),
      ),
    )
    .limit(1);

  // Decision #108: missing property and inaccessible property are indistinguishable.
  // Never return ForbiddenError — always NotFoundError so probing foreign UUIDs reveals nothing.
  if (rows.length === 0) return err(appError.notFound("property", propertyId));
  return ok(rows[0]!);
};

// Guard for mutations (Server Actions).
// Returns the confirmed role if the user's role is >= minRole, NotFoundError otherwise.
// Same 404-masking rationale: insufficient role is indistinguishable from no access.
export const requirePropertyRole = async (
  userId: UserId,
  propertyId: PropertyId,
  minRole: TPropertyRole,
): Promise<Result<TPropertyRole, TAppError>> => {
  const result = await propertyByIdForUser(userId, propertyId);
  if (!result.ok) return result;

  if (!roleAtLeast(result.value.role, minRole)) {
    return err(appError.notFound("property", propertyId));
  }

  return ok(result.value.role);
};
