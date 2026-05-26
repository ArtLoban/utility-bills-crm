"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { bills } from "@/lib/db/schema/bills";
import type { BillId, TBill } from "@/lib/db/schema/bills";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import type { UserId } from "@/lib/db/schema/auth";
import { billByIdForUser } from "@/lib/db/access/bills";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { createBillSchema, updateBillSchema } from "./schema";
import type { TCreateBillInput, TUpdateBillInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

// Expands "YYYY-MM" month string into the date triple (ISO date strings).
const expandMonth = (
  month: string,
): { periodStart: string; periodEnd: string; periodMonth: string } => {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const mo = Number(monthStr);
  const firstDay = new Date(Date.UTC(year, mo - 1, 1));
  const lastDay = new Date(Date.UTC(year, mo, 0)); // day 0 of next month = last day of current
  return {
    periodStart: firstDay.toISOString().slice(0, 10),
    periodEnd: lastDay.toISOString().slice(0, 10),
    periodMonth: firstDay.toISOString().slice(0, 10),
  };
};

export const createBill = async (
  input: TCreateBillInput,
): Promise<Result<TBill, ValidationError | NotFoundError>> => {
  const parsed = createBillSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();
  const serviceId = parsed.data.serviceId as TServiceId;

  const [service] = await db
    .select({ propertyId: services.propertyId })
    .from(services)
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (!service) return err(new NotFoundError("service", serviceId));

  const guard = await requirePropertyRole(userId, service.propertyId, "editor");
  if (!guard.ok) return guard;

  const { periodStart, periodEnd, periodMonth } = expandMonth(parsed.data.month);

  const [row] = await db
    .insert(bills)
    .values({
      serviceId,
      periodStart,
      periodEnd,
      periodMonth,
      amount: String(parsed.data.amount),
      notes: parsed.data.notes || null,
      createdBy: userId,
    })
    .returning();

  revalidatePath("/bills");
  return ok(row!);
};

export const editBill = async (
  billId: BillId,
  input: TUpdateBillInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = updateBillSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();

  const access = await billByIdForUser(userId, billId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, "editor");
  if (!guard.ok) return guard;

  const updateValues: Record<string, unknown> = {};

  if (parsed.data.month !== undefined) {
    const { periodStart, periodEnd, periodMonth } = expandMonth(parsed.data.month);
    updateValues.periodStart = periodStart;
    updateValues.periodEnd = periodEnd;
    updateValues.periodMonth = periodMonth;
  }

  if (parsed.data.amount !== undefined) {
    updateValues.amount = String(parsed.data.amount);
  }

  if (parsed.data.notes !== undefined) {
    updateValues.notes = parsed.data.notes || null;
  }

  if (Object.keys(updateValues).length > 0) {
    await db
      .update(bills)
      .set(updateValues)
      .where(and(eq(bills.id, billId), isNull(bills.deletedAt)));
  }

  revalidatePath("/bills");
  return ok(undefined);
};

export const softDeleteBill = async (billId: BillId): Promise<Result<void, NotFoundError>> => {
  const userId = await requireAuth();

  const access = await billByIdForUser(userId, billId);
  if (!access.ok) return access;

  const guard = await requirePropertyRole(userId, access.value.property.id, "editor");
  if (!guard.ok) return guard;

  await db
    .update(bills)
    .set({ deletedAt: new Date() })
    .where(and(eq(bills.id, billId), isNull(bills.deletedAt)));

  revalidatePath("/bills");
  return ok(undefined);
};
