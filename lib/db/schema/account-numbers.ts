import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type TContractId, contracts } from "./contracts";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const accountNumberIdBrand: unique symbol;
export type TAccountNumberId = string & {
  readonly [accountNumberIdBrand]: typeof accountNumberIdBrand;
};

// --- Table ---
// Half-open temporal interval [validFrom, validTo). validTo = NULL means "still current".
// No format constraint on value — provider-assigned IDs vary widely.
// Exclusion constraint (account_numbers_no_overlap_excl) is applied manually in the migration SQL.

export const accountNumbers = pgTable(
  "account_numbers",
  {
    id: brandedUuidPk<TAccountNumberId>(),
    contractId: uuid("contract_id")
      .notNull()
      .$type<TContractId>()
      .references(() => contracts.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("account_numbers_contract_id_valid_from_idx").on(t.contractId, t.validFrom),
    index("account_numbers_deleted_at_idx").on(t.deletedAt),
    check(
      "account_numbers_valid_to_check",
      sql`${t.validTo} IS NULL OR ${t.validTo} > ${t.validFrom}`,
    ),
  ],
);

// --- Exported types ---

export type TAccountNumber = typeof accountNumbers.$inferSelect;
export type TNewAccountNumber = typeof accountNumbers.$inferInsert;
