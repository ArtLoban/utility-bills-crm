"use server";

import { and, eq } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { roleAtLeast } from "@/lib/db/access/properties";
import { serviceByIdForUser } from "@/lib/db/access/services";
import { db } from "@/lib/db/client";
import type { UserId } from "@/lib/db/schema/auth";
import { reminders } from "@/lib/db/schema/notifications";
import type { ReminderId } from "@/lib/db/schema/notifications";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import {
  DemoModeError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  err,
  ok,
} from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { createReminderSchema, editReminderSchema } from "./schema";
import type { TCreateReminderInput, TEditReminderInput } from "./schema";

// Create authorizes on the target service: any editor/owner on the service's property may
// add a reminder there. (Edit/delete authorize differently — by reminder ownership.)
//   NotFoundError  — service missing or wholly inaccessible (404-masked in serviceByIdForUser).
//   ForbiddenError — caller can see the service (viewer) but lacks editor rights. A viewer
//                    already knows the service exists, so this leaks nothing and still maps
//                    to 404 at the HTTP boundary via shouldHideAsNotFound (#108).
const requireServiceEditor = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<Result<void, NotFoundError | ForbiddenError>> => {
  const access = await serviceByIdForUser(userId, serviceId);
  if (!access.ok) return access;

  if (!roleAtLeast(access.value.role, PROPERTY_ROLES.EDITOR)) {
    return err(new ForbiddenError());
  }
  return ok(undefined);
};

export const createReminder = async (
  input: TCreateReminderInput,
): Promise<
  Result<ReminderId, ValidationError | NotFoundError | ForbiddenError | DemoModeError>
> => {
  const parsed = createReminderSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const { serviceId, anchorType, anchorValue, text } = parsed.data;

  const guard = await requireServiceEditor(userId, serviceId as TServiceId);
  if (!guard.ok) return guard;

  const [created] = await db
    .insert(reminders)
    .values({ userId, serviceId: serviceId as TServiceId, anchorType, anchorValue, text })
    .returning({ id: reminders.id });

  return ok(created!.id);
};

export const editReminder = async (
  reminderId: ReminderId,
  input: TEditReminderInput,
): Promise<Result<void, ValidationError | NotFoundError | DemoModeError>> => {
  const parsed = editReminderSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  // Edit is scoped to the owner: a reminder owned by another user is indistinguishable
  // from a nonexistent one — both surface as NotFoundError. No service-role gate.
  const [existing] = await db
    .select({ id: reminders.id })
    .from(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)))
    .limit(1);

  if (!existing) {
    return err(new NotFoundError("reminder", reminderId));
  }

  const { anchorType, anchorValue, text } = parsed.data;

  await db
    .update(reminders)
    .set({ anchorType, anchorValue, text })
    .where(eq(reminders.id, reminderId));

  return ok(undefined);
};

export const deleteReminder = async (
  reminderId: ReminderId,
): Promise<Result<void, NotFoundError | DemoModeError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  // Delete is scoped to the owner: another user's reminder reads as NotFoundError.
  const [existing] = await db
    .select({ id: reminders.id })
    .from(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)))
    .limit(1);

  if (!existing) {
    return err(new NotFoundError("reminder", reminderId));
  }

  // Hard-delete — reminders carry no audit value and have no incoming foreign keys.
  await db.delete(reminders).where(eq(reminders.id, reminderId));

  return ok(undefined);
};
