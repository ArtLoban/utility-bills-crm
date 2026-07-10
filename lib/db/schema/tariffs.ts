import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type TContractId, contracts } from "./contracts";
import { brandedUuidPk, money, rate, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const tariffIdBrand: unique symbol;
export type TTariffId = string & { readonly [tariffIdBrand]: typeof tariffIdBrand };

// --- Table ---
// Half-open temporal interval [validFrom, validTo). validTo = NULL means "still current".
// Metered XOR fixed: either rateT1 (+ optional rateT2/rateT3) or fixedAmount — never both, never neither.
// Exclusion constraint (tariffs_no_overlap_excl) is NOT expressed in this Drizzle definition
// because Drizzle does not support EXCLUDE USING gist. It is applied manually in the migration SQL.

export const tariffs = pgTable(
  "tariffs",
  {
    id: brandedUuidPk<TTariffId>(),
    contractId: uuid("contract_id")
      .notNull()
      .$type<TContractId>()
      .references(() => contracts.id, { onDelete: "cascade" }),
    // Metered shape: rateT1 required, rateT2/rateT3 optional (zone-based services).
    rateT1: rate("rate_t1"),
    rateT2: rate("rate_t2"),
    rateT3: rate("rate_t3"),
    // Fixed shape: single amount, no per-unit rates.
    fixedAmount: money("fixed_amount"),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("tariffs_contract_id_valid_from_idx").on(t.contractId, t.validFrom),
    index("tariffs_deleted_at_idx").on(t.deletedAt),
    check("tariffs_valid_to_check", sql`${t.validTo} IS NULL OR ${t.validTo} > ${t.validFrom}`),
    // Metered XOR fixed: one shape must be present, never both.
    check(
      "tariffs_metered_xor_fixed_check",
      sql`(${t.rateT1} IS NOT NULL AND ${t.fixedAmount} IS NULL) OR (${t.fixedAmount} IS NOT NULL AND ${t.rateT1} IS NULL)`,
    ),
    // Rates, if present, must be positive.
    check(
      "tariffs_rates_positive_check",
      sql`(${t.rateT1} IS NULL OR ${t.rateT1} > 0) AND (${t.rateT2} IS NULL OR ${t.rateT2} > 0) AND (${t.rateT3} IS NULL OR ${t.rateT3} > 0)`,
    ),
    // Fixed amount, if present, must be non-negative (zero is a valid fixed tariff).
    check("tariffs_fixed_nonneg_check", sql`${t.fixedAmount} IS NULL OR ${t.fixedAmount} >= 0`),
    // Populated rate zones must be contiguous from T1: a higher zone may not be set while a
    // lower one is null. Fixed-amount tariffs have all rates null — allowed by the XOR check.
    check(
      "tariffs_zones_contiguous_check",
      sql`(${t.rateT2} IS NULL OR ${t.rateT1} IS NOT NULL) AND (${t.rateT3} IS NULL OR ${t.rateT2} IS NOT NULL)`,
    ),
  ],
);

// --- Exported types ---

export type TTariff = typeof tariffs.$inferSelect;
export type TNewTariff = typeof tariffs.$inferInsert;
