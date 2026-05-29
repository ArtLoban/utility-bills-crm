import { sql } from "drizzle-orm";
import { check, date, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { type TServiceId, services } from "./services";
import { brandedUuidPk, money, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const paymentIdBrand: unique symbol;
export type PaymentId = string & { readonly [paymentIdBrand]: typeof paymentIdBrand };

// --- Table ---

export const payments = pgTable(
  "payments",
  {
    id: brandedUuidPk<PaymentId>(),
    serviceId: uuid("service_id")
      .notNull()
      .$type<TServiceId>()
      .references(() => services.id, { onDelete: "cascade" }),
    paidAt: date("paid_at").notNull(),
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
    index("payments_service_id_paid_at_idx").on(t.serviceId, t.paidAt),
    index("payments_created_by_idx").on(t.createdBy),
    index("payments_deleted_at_idx").on(t.deletedAt),
    // Strictly positive: a zero payment is meaningless (Decision #32 + DATA_MODEL.md Block 6).
    check("payments_amount_check", sql`${t.amount} > 0`),
  ],
);

// --- Exported types ---

export type TPayment = typeof payments.$inferSelect;
export type TNewPayment = typeof payments.$inferInsert;
