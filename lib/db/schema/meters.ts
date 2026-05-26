import { sql } from "drizzle-orm";
import { check, index, pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type PropertyId, properties } from "./properties";
import { type TServiceTypeId, serviceTypes } from "./service-types";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const meterIdBrand: unique symbol;
export type MeterId = string & { readonly [meterIdBrand]: typeof meterIdBrand };

// --- Table ---
// Half-open temporal interval [validFrom, validTo). validTo = NULL means "currently active".
// installedAt / removedAt are physical, user-declared, informational — NOT used for the exclusion
// constraint and NOT used to determine whether a meter is active.
// Exclusion constraint (meters_no_overlap_excl) is NOT expressed here because Drizzle does not
// support EXCLUDE USING gist. It is applied manually in the migration SQL (same pattern as tariffs).

export const meters = pgTable(
  "meters",
  {
    id: brandedUuidPk<MeterId>(),
    propertyId: uuid("property_id")
      .notNull()
      .$type<PropertyId>()
      .references(() => properties.id, { onDelete: "cascade" }),
    serviceTypeId: uuid("service_type_id")
      .notNull()
      .$type<TServiceTypeId>()
      .references(() => serviceTypes.id, { onDelete: "restrict" }),
    serialNumber: text("serial_number"),
    // 1, 2, or 3 zones. If serviceType.supportsZones = false, application enforces zoneCount = 1.
    zoneCount: smallint("zone_count").notNull().default(1),
    installedAt: timestamp("installed_at", { withTimezone: true }),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("meters_property_id_service_type_id_valid_from_idx").on(
      t.propertyId,
      t.serviceTypeId,
      t.validFrom,
    ),
    index("meters_deleted_at_idx").on(t.deletedAt),
    check("meters_zone_count_check", sql`${t.zoneCount} IN (1, 2, 3)`),
    check("meters_valid_to_check", sql`${t.validTo} IS NULL OR ${t.validTo} > ${t.validFrom}`),
    check(
      "meters_removed_at_check",
      sql`${t.removedAt} IS NULL OR ${t.installedAt} IS NULL OR ${t.removedAt} > ${t.installedAt}`,
    ),
  ],
);

// --- Exported types ---

export type TMeter = typeof meters.$inferSelect;
export type TNewMeter = typeof meters.$inferInsert;
