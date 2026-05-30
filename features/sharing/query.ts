import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db/client";
import { propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { propertyByIdForUser } from "@/lib/db/access/properties";

export type TPropertyMember = {
  userId: UserId;
  name: string | null;
  email: string;
  image: string | null;
  role: TPropertyRole;
  grantedAt: Date;
  // null when propertyAccess.grantedBy is NULL (granter deleted → ON DELETE SET NULL)
  grantedBy: { userId: UserId; name: string | null } | null;
};

// Returns all active members of a property visible to `userId`.
// Access gate: any active role (owner/editor/viewer) is sufficient — per the design.
// 404-masking (#108): no access and nonexistent property are indistinguishable.
export const propertyMembers = async (
  userId: UserId,
  propertyId: PropertyId,
): Promise<Result<TPropertyMember[], NotFoundError>> => {
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const granterUser = alias(users, "granter_user");

  const rows = await db
    .select({
      userId: propertyAccess.userId,
      name: users.name,
      email: users.email,
      image: users.image,
      role: propertyAccess.propertyRole,
      grantedAt: propertyAccess.grantedAt,
      granterUserId: granterUser.id,
      granterName: granterUser.name,
    })
    .from(propertyAccess)
    .innerJoin(users, eq(propertyAccess.userId, users.id))
    .leftJoin(granterUser, eq(propertyAccess.grantedBy, granterUser.id))
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        isNull(propertyAccess.deletedAt),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(
      sql`CASE ${propertyAccess.propertyRole} WHEN 'owner' THEN 0 WHEN 'editor' THEN 1 WHEN 'viewer' THEN 2 END`,
      asc(propertyAccess.grantedAt),
    );

  return ok(
    rows.map((row) => ({
      userId: row.userId,
      name: row.name,
      email: row.email,
      image: row.image,
      role: row.role,
      grantedAt: row.grantedAt,
      grantedBy:
        row.granterUserId !== null ? { userId: row.granterUserId, name: row.granterName } : null,
    })),
  );
};
