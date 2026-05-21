import { numeric, text, timestamp, uuid } from "drizzle-orm/pg-core";

// --- Branded UUID primary key ---
// Each entity declares its own brand + type, then uses this helper:
//   declare const propertyIdBrand: unique symbol;
//   export type PropertyId = string & { readonly [propertyIdBrand]: typeof propertyIdBrand };
//   id: brandedUuidPk<PropertyId>()
export const brandedUuidPk = <T extends string>() =>
  uuid("id").primaryKey().defaultRandom().$type<T>();

// --- Timestamp columns ---
// Spread into every domain table: { ...timestamps() }
export const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// --- Soft-delete column ---
// NULL = active. Non-null = soft-deleted at that moment.
// All domain queries filter deletedAt IS NULL by default; admin queries opt out explicitly.
export const softDelete = () => ({
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// --- Named numeric precision helpers ---
// No ad-hoc precision anywhere — always use these named helpers.
export const money = (name: string) => numeric(name, { precision: 12, scale: 2 });
export const rate = (name: string) => numeric(name, { precision: 12, scale: 4 });
export const meterValue = (name: string) => numeric(name, { precision: 12, scale: 3 });

// --- Text enum column ---
// Implementation: text + CHECK constraint (not native PG ENUM) per DATA_MODEL.md convention.
// Returns a text column with TypeScript union inference.
// CHECK constraint must still be added explicitly in table constraints.
// Callers define values as a const tuple to serve as the single source of truth for both:
//
//   const PROPERTY_TYPES = ["apartment", "house", "cottage", "other"] as const;
//   type TPropertyType = (typeof PROPERTY_TYPES)[number];
//
//   // column:
//   type: textEnum("type", PROPERTY_TYPES).notNull()
//
//   // table constraint:
//   check("properties_type_check", sql`${t.type} IN ('apartment', 'house', 'cottage', 'other')`)
export const textEnum = <T extends string>(name: string, values: readonly [T, ...T[]]) =>
  text(name, { enum: values as [T, ...T[]] });
