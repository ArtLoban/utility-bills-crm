import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { type MeterId, meters } from "./meters";
import { brandedUuidPk, meterValue, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const readingIdBrand: unique symbol;
export type ReadingId = string & { readonly [readingIdBrand]: typeof readingIdBrand };

// --- Table ---
// valueT1 is required (zone 1 / single-zone value).
// valueT2 / valueT3 are NULL for single-zone meters, non-null for 2-zone / 3-zone meters respectively.
// Zone-value consistency with meter.zoneCount is enforced at application level (cross-table invariant).
// Check constraints only enforce non-negativity (expressible at row level).

export const readings = pgTable(
  "readings",
  {
    id: brandedUuidPk<ReadingId>(),
    meterId: uuid("meter_id")
      .notNull()
      .$type<MeterId>()
      .references(() => meters.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }).notNull(),
    valueT1: meterValue("value_t1").notNull(),
    valueT2: meterValue("value_t2"),
    valueT3: meterValue("value_t3"),
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
    index("readings_meter_id_read_at_idx").on(t.meterId, t.readAt),
    index("readings_created_by_idx").on(t.createdBy),
    index("readings_deleted_at_idx").on(t.deletedAt),
    check("readings_value_t1_check", sql`${t.valueT1} >= 0`),
    check("readings_value_t2_check", sql`${t.valueT2} IS NULL OR ${t.valueT2} >= 0`),
    check("readings_value_t3_check", sql`${t.valueT3} IS NULL OR ${t.valueT3} >= 0`),
  ],
);

// --- Exported types ---

export type TReading = typeof readings.$inferSelect;
export type TNewReading = typeof readings.$inferInsert;
