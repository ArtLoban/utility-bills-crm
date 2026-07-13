"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { payments } from "@/lib/db/schema/payments";
import type { PaymentId, TPayment } from "@/lib/db/schema/payments";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { paymentByIdForUser } from "@/lib/db/access/payments";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { ROUTES, paymentPath } from "@/lib/routes";
import { createPaymentSchema, updatePaymentSchema } from "./schema";
import type { TCreatePaymentInput, TUpdatePaymentInput } from "./schema";

export const recordPayment = async (
  input: TCreatePaymentInput,
): Promise<Result<TPayment, TAppError>> => {
  const parsed = createPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const serviceId = parsed.data.serviceId as TServiceId;

  const [service] = await db
    .select({ propertyId: services.propertyId })
    .from(services)
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (!service) return err(appError.notFound("service", serviceId));

  const guard = await requirePropertyRole(userId, service.propertyId, PROPERTY_ROLES.EDITOR);
  if (!guard.ok) return guard;

  const [row] = await db
    .insert(payments)
    .values({
      serviceId,
      paidAt: parsed.data.paidAt,
      amount: String(parsed.data.amount),
      notes: parsed.data.notes || null,
      createdBy: userId,
    })
    .returning();

  revalidatePath(ROUTES.payments);
  return ok(row!);
};

export const editPayment = async (
  paymentId: PaymentId,
  input: TUpdatePaymentInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updatePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentByIdForUser(userId, paymentId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, PROPERTY_ROLES.EDITOR);
  if (!guard.ok) return guard;

  const updateValues: Record<string, unknown> = {};

  if (parsed.data.paidAt !== undefined) updateValues.paidAt = parsed.data.paidAt;
  if (parsed.data.amount !== undefined) updateValues.amount = String(parsed.data.amount);
  if (parsed.data.notes !== undefined) updateValues.notes = parsed.data.notes || null;

  if (Object.keys(updateValues).length > 0) {
    await db
      .update(payments)
      .set(updateValues)
      .where(and(eq(payments.id, paymentId), isNull(payments.deletedAt)));
  }

  revalidatePath(ROUTES.payments);
  revalidatePath(paymentPath(paymentId));
  return ok(undefined);
};

export const softDeletePayment = async (paymentId: PaymentId): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentByIdForUser(userId, paymentId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, PROPERTY_ROLES.EDITOR);
  if (!guard.ok) return guard;

  await db
    .update(payments)
    .set({ deletedAt: new Date() })
    .where(and(eq(payments.id, paymentId), isNull(payments.deletedAt)));

  revalidatePath(ROUTES.payments);
  return ok(undefined);
};
