"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { ForbiddenError, NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { inviteSchema, changeRoleSchema, removeAccessSchema } from "./schema";
import type { TInviteInput, TChangeRoleInput, TRemoveAccessInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
// Auth middleware prevents reaching server actions unauthenticated; if it does
// happen, it is a bug, not a user-facing condition.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

export const inviteToProperty = async (
  propertyId: PropertyId,
  input: TInviteInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  const guard = await requirePropertyRole(currentUserId, propertyId, "owner");
  if (!guard.ok) return guard;

  const { email, role } = parsed.data;

  const [targetUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (!targetUser) {
    return err(new ValidationError("USER_NOT_FOUND"));
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
    return err(new ValidationError("ALREADY_HAS_ACCESS"));
  }

  // grantedAt defaults to NOW() via the DB column default — not set explicitly.
  await db.insert(propertyAccess).values({
    propertyId,
    userId: targetUser.id,
    propertyRole: role,
    grantedBy: currentUserId,
  });

  revalidatePath(`/properties/${propertyId}/sharing`);
  return ok(undefined);
};

export const changePropertyRole = async (
  propertyId: PropertyId,
  input: TChangeRoleInput,
): Promise<Result<void, ValidationError | NotFoundError | ForbiddenError>> => {
  const parsed = changeRoleSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  const guard = await requirePropertyRole(currentUserId, propertyId, "owner");
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
    return err(new NotFoundError("member", targetUserId));
  }

  if (targetAccess.role === newRole) {
    return ok(undefined);
  }

  // Another owner's role is immutable — only that owner can act on their own ownership.
  if (targetUserId !== currentUserId && targetAccess.role === "owner") {
    return err(new ForbiddenError("OWNER_PROTECTED"));
  }

  const result = await db.transaction(async (tx) => {
    // Lock active owner rows to prevent a concurrent double-downgrade from reaching zero owners.
    const ownerRows = await tx
      .select({ userId: propertyAccess.userId })
      .from(propertyAccess)
      .where(
        and(
          eq(propertyAccess.propertyId, propertyId),
          eq(propertyAccess.propertyRole, "owner"),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .for("update");

    if (ownerRows.length === 1 && ownerRows[0]!.userId === targetUserId && newRole !== "owner") {
      return err(new ForbiddenError("LAST_OWNER"));
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
): Promise<Result<void, NotFoundError | ForbiddenError>> => {
  const parsed = removeAccessSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ForbiddenError("Invalid input"));
  }

  const currentUserId = await requireAuth();

  const guard = await requirePropertyRole(currentUserId, propertyId, "owner");
  if (!guard.ok) return guard;

  const { targetUserId } = parsed.data;

  // Self-removal uses leaveProperty — this action is for removing others.
  if (targetUserId === currentUserId) {
    return err(new ForbiddenError("SELF_REMOVAL_NOT_ALLOWED"));
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
    return err(new NotFoundError("member", targetUserId));
  }

  // Owners are protected — another owner must leave themselves via leaveProperty.
  if (targetAccess.role === "owner") {
    return err(new ForbiddenError("OWNER_PROTECTED"));
  }

  await db
    .update(propertyAccess)
    .set({ deletedAt: new Date() })
    .where(and(eq(propertyAccess.id, targetAccess.id), isNull(propertyAccess.deletedAt)));

  revalidatePath(`/properties/${propertyId}/sharing`);
  return ok(undefined);
};

export const leaveProperty = async (
  propertyId: PropertyId,
): Promise<Result<void, NotFoundError | ForbiddenError>> => {
  const currentUserId = await requireAuth();

  const [ownAccess] = await db
    .select({ id: propertyAccess.id, role: propertyAccess.propertyRole })
    .from(propertyAccess)
    .where(
      and(
        eq(propertyAccess.propertyId, propertyId),
        eq(propertyAccess.userId, currentUserId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .limit(1);

  if (!ownAccess) {
    return err(new NotFoundError("property", propertyId));
  }

  if (ownAccess.role === "owner") {
    // Lock owner rows and check last-owner constraint inside the transaction
    // to prevent a concurrent double-leave from dropping the property to zero owners.
    const result = await db.transaction(async (tx) => {
      const ownerRows = await tx
        .select({ id: propertyAccess.id })
        .from(propertyAccess)
        .where(
          and(
            eq(propertyAccess.propertyId, propertyId),
            eq(propertyAccess.propertyRole, "owner"),
            isNull(propertyAccess.deletedAt),
          ),
        )
        .for("update");

      if (ownerRows.length === 1) {
        return err(new ForbiddenError("LAST_OWNER"));
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
