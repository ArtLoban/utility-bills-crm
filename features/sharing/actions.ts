"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { INVITE_ERROR, inviteSchema, changeRoleSchema, removeAccessSchema } from "./schema";
import type { TInviteInput, TChangeRoleInput, TRemoveAccessInput } from "./schema";

export const inviteToProperty = async (
  propertyId: PropertyId,
  input: TInviteInput,
): Promise<Result<void, TAppError>> => {
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.OWNER);
  if (!guard.ok) return guard;

  const { email, role } = parsed.data;

  const [targetUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (!targetUser) {
    return err(appError.validation(INVITE_ERROR.USER_NOT_FOUND));
  }

  const [existingAccess] = await db
    .select({ id: propertyAccess.id })
    .from(propertyAccess)
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, targetUser.id),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .limit(1);

  if (existingAccess) {
    return err(appError.validation(INVITE_ERROR.ALREADY_HAS_ACCESS));
  }

  // grantedAt defaults to NOW() via the DB column default — not set explicitly.
  await db.insert(propertyAccess).values({
    propertyId,
    userId: targetUser.id,
    propertyRole: role,
    grantedBy: userId,
  });

  revalidatePath(`/properties/${propertyId}/sharing`);
  return ok(undefined);
};

export const changePropertyRole = async (
  propertyId: PropertyId,
  input: TChangeRoleInput,
): Promise<Result<void, TAppError>> => {
  const parsed = changeRoleSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.OWNER);
  if (!guard.ok) return guard;

  const { targetUserId, newRole } = parsed.data;

  const [targetAccess] = await db
    .select({ id: propertyAccess.id, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, targetUserId as UserId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .limit(1);

  if (!targetAccess) {
    return err(appError.notFound("member", targetUserId));
  }

  if (targetAccess.role === newRole) {
    return ok(undefined);
  }

  // Another owner's role is immutable — only that owner can act on their own ownership.
  if (targetUserId !== userId && targetAccess.role === PROPERTY_ROLES.OWNER) {
    return err(appError.forbidden("OWNER_PROTECTED"));
  }

  const result = await db.transaction(async (tx) => {
    // Lock active owner rows to prevent a concurrent double-downgrade from reaching zero owners.
    const ownerRows = await tx
      .select({ userId: propertyAccess.userId })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, propertyId),
          eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .for("update");

    if (
      ownerRows.length === 1 &&
      ownerRows[0]!.userId === targetUserId &&
      newRole !== PROPERTY_ROLES.OWNER
    ) {
      return err(appError.forbidden("LAST_OWNER"));
    }

    // Update role only — grantedBy and grantedAt are never overwritten after creation.
    await tx
      .update(propertyAccess)
      .set({ propertyRole: newRole })
      .where(and(eq(propertyAccess.id, targetAccess.id), isNull(propertyAccess.deletedAt)));

    return ok(undefined);
  });

  if (result.ok) {
    revalidatePath(`/properties/${propertyId}/sharing`);
  }
  return result;
};

export const removePropertyAccess = async (
  propertyId: PropertyId,
  input: TRemoveAccessInput,
): Promise<Result<void, TAppError>> => {
  const parsed = removeAccessSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.forbidden("Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.OWNER);
  if (!guard.ok) return guard;

  const { targetUserId } = parsed.data;

  // Self-removal uses leaveProperty — this action is for removing others.
  if (targetUserId === userId) {
    return err(appError.forbidden("SELF_REMOVAL_NOT_ALLOWED"));
  }

  const [targetAccess] = await db
    .select({ id: propertyAccess.id, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, targetUserId as UserId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .limit(1);

  if (!targetAccess) {
    return err(appError.notFound("member", targetUserId));
  }

  // Owners are protected — another owner must leave themselves via leaveProperty.
  if (targetAccess.role === PROPERTY_ROLES.OWNER) {
    return err(appError.forbidden("OWNER_PROTECTED"));
  }

  await db
    .update(propertyAccess)
    .set({ deletedAt: new Date() })
    .where(and(eq(propertyAccess.id, targetAccess.id), isNull(propertyAccess.deletedAt)));

  revalidatePath(`/properties/${propertyId}/sharing`);
  return ok(undefined);
};

export const leaveProperty = async (propertyId: PropertyId): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const [ownAccess] = await db
    .select({ id: propertyAccess.id, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .limit(1);

  if (!ownAccess) {
    return err(appError.notFound("property", propertyId));
  }

  if (ownAccess.role === PROPERTY_ROLES.OWNER) {
    // Lock owner rows and check last-owner constraint inside the transaction
    // to prevent a concurrent double-leave from dropping the property to zero owners.
    const result = await db.transaction(async (tx) => {
      const ownerRows = await tx
        .select({ id: propertyAccess.id })
        .from(propertyAccess)
        .where(
          and(
            eq(propertyAccess.propertyId, propertyId),
            eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
            isNull(propertyAccess.deletedAt),
          ),
        )
        .for("update");

      if (ownerRows.length === 1) {
        return err(appError.forbidden("LAST_OWNER"));
      }

      await tx
        .update(propertyAccess)
        .set({ deletedAt: new Date() })
        .where(and(eq(propertyAccess.id, ownAccess.id), isNull(propertyAccess.deletedAt)));

      return ok(undefined);
    });

    if (!result.ok) return result;
  } else {
    // Non-owners (editor/viewer) always can leave — no last-owner concern, no lock needed.
    await db
      .update(propertyAccess)
      .set({ deletedAt: new Date() })
      .where(and(eq(propertyAccess.id, ownAccess.id), isNull(propertyAccess.deletedAt)));
  }

  revalidatePath(`/properties/${propertyId}/sharing`);
  revalidatePath("/properties");
  return ok(undefined);
};
