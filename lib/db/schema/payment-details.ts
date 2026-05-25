import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type TContractId, contracts } from "./contracts";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const paymentDetailsIdBrand: unique symbol;
export type TPaymentDetailsId = string & {
  readonly [paymentDetailsIdBrand]: typeof paymentDetailsIdBrand;
};

// --- Table ---
// Half-open temporal interval [validFrom, validTo). validTo = NULL means "still current".
// details is free-form multiline text: IBAN, QR payload, wire transfer info, etc.
// Exclusion constraint (payment_details_no_overlap_excl) is applied manually in the migration SQL.

export const paymentDetails = pgTable(
  "payment_details",
  {
    id: brandedUuidPk<TPaymentDetailsId>(),
    contractId: uuid("contract_id")
      .notNull()
      .$type<TContractId>()
      .references(() => contracts.id, { onDelete: "cascade" }),
    details: text("details").notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("payment_details_contract_id_valid_from_idx").on(t.contractId, t.validFrom),
    index("payment_details_deleted_at_idx").on(t.deletedAt),
    check(
      "payment_details_valid_to_check",
      sql`${t.validTo} IS NULL OR ${t.validTo} > ${t.validFrom}`,
    ),
  ],
);

// --- Exported types ---

export type TPaymentDetails = typeof paymentDetails.$inferSelect;
export type TNewPaymentDetails = typeof paymentDetails.$inferInsert;
