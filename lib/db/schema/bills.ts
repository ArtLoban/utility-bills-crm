import { sql } from "drizzle-orm";
import { check, date, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { type TServiceId, services } from "./services";
import { brandedUuidPk, money, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const billIdBrand: unique symbol;
export type BillId = string & { readonly [billIdBrand]: typeof billIdBrand };

// --- Table ---

export const bills = pgTable(
  "bills",
  {
    id: brandedUuidPk<BillId>(),
    serviceId: uuid("service_id")
      .notNull()
      .$type<TServiceId>()
      .references(() => services.id, { onDelete: "cascade" }),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    // First day of the attribution month. Always date_trunc('month', ...).
    periodMonth: date("period_month").notNull(),
    amount: money("amount").notNull(),
    notes: text("notes"),
    // Nullable to allow ON DELETE SET NULL when the user is hard-deleted.
    // Application always sets this on insert; NULL only appears after user deletion.
    createdBy: uuid("created_by")
      .$type<UserId>()
      .references(() => users.id, { onDelete: "set null" }),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("bills_service_id_period_month_idx").on(t.serviceId, t.periodMonth),
    index("bills_service_id_period_range_idx").on(t.serviceId, t.periodStart, t.periodEnd),
    index("bills_created_by_idx").on(t.createdBy),
    index("bills_deleted_at_idx").on(t.deletedAt),
    check("bills_amount_check", sql`${t.amount} >= 0`),
    check("bills_period_end_check", sql`${t.periodEnd} >= ${t.periodStart}`),
    check(
      "bills_period_month_trunc_check",
      sql`${t.periodMonth} = date_trunc('month', ${t.periodMonth})::date`,
    ),
    check(
      "bills_period_month_overlap_check",
      sql`${t.periodMonth} >= date_trunc('month', ${t.periodStart})::date AND ${t.periodMonth} <= date_trunc('month', ${t.periodEnd})::date`,
    ),
  ],
);

// --- Exported types ---

export type TBill = typeof bills.$inferSelect;
export type TNewBill = typeof bills.$inferInsert;
