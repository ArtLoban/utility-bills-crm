import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { brandedUuidPk, textEnum, timestamps } from "./helpers";

// --- Branded type ---

declare const serviceTypeIdBrand: unique symbol;
export type TServiceTypeId = string & { readonly [serviceTypeIdBrand]: typeof serviceTypeIdBrand };

// --- Enum tuples (single source of truth for column + CHECK constraint) ---

export const MEASUREMENT_TYPES = ["metered", "fixed"] as const;
export type TMeasurementType = (typeof MEASUREMENT_TYPES)[number];

export const SERVICE_TYPE_UNITS = ["kwh", "m3", "gcal"] as const;
export type TServiceTypeUnit = (typeof SERVICE_TYPE_UNITS)[number];

// --- Table ---

export const serviceTypes = pgTable(
  "service_types",
  {
    id: brandedUuidPk<TServiceTypeId>(),
    code: text("code").notNull(),
    measurementType: textEnum("measurement_type", MEASUREMENT_TYPES).notNull(),
    // Nullable: required for metered, NULL for fixed — enforced by the cross-field CHECK below
    unit: textEnum("unit", SERVICE_TYPE_UNITS),
    supportsZones: boolean("supports_zones").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps(),
    // No softDelete() — retirement handled via isActive, not deletedAt
  },
  (t) => [
    uniqueIndex("service_types_code_unique_idx").on(t.code),
    index("service_types_active_sort_idx").on(t.isActive, t.sortOrder),
    check(
      "service_types_measurement_type_check",
      sql`${t.measurementType} IN ('metered', 'fixed')`,
    ),
    check("service_types_unit_check", sql`${t.unit} IN ('kwh', 'm3', 'gcal') OR ${t.unit} IS NULL`),
    // metered iff unit is present — ties measurementType to unit presence at the DB level
    check(
      "service_types_metered_unit_check",
      sql`(${t.measurementType} = 'metered') = (${t.unit} IS NOT NULL)`,
    ),
  ],
);

// --- Exported types ---

export type TServiceType = typeof serviceTypes.$inferSelect;
export type TNewServiceType = typeof serviceTypes.$inferInsert;
