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
import { DemoModeError, NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { createPaymentSchema, updatePaymentSchema } from "./schema";
import type { TCreatePaymentInput, TUpdatePaymentInput } from "./schema";

export const recordPayment = async (
  input: TCreatePaymentInput,
): Promise<Result<TPayment, ValidationError | NotFoundError | DemoModeError>> => {
  const parsed = createPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
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

  if (!service) return err(new NotFoundError("service", serviceId));

  const guard = await requirePropertyRole(userId, service.propertyId, "editor");
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

  revalidatePath("/payments");
  return ok(row!);
};

export const editPayment = async (
  paymentId: PaymentId,
  input: TUpdatePaymentInput,
): Promise<Result<void, ValidationError | NotFoundError | DemoModeError>> => {
  const parsed = updatePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentByIdForUser(userId, paymentId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, "editor");
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

  revalidatePath("/payments");
  return ok(undefined);
};

export const softDeletePayment = async (
  paymentId: PaymentId,
): Promise<Result<void, NotFoundError | DemoModeError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const access = await paymentByIdForUser(userId, paymentId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, "editor");
  if (!guard.ok) return guard;

  await db
    .update(payments)
    .set({ deletedAt: new Date() })
    .where(and(eq(payments.id, paymentId), isNull(payments.deletedAt)));

  revalidatePath("/payments");
  return ok(undefined);
};
