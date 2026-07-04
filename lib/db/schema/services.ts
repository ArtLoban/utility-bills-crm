import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { type PropertyId, properties } from "./properties";
import { type TServiceTypeId, serviceTypes } from "./service-types";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const serviceIdBrand: unique symbol;
export type TServiceId = string & { readonly [serviceIdBrand]: typeof serviceIdBrand };

// --- Table ---

export const services = pgTable(
  "services",
  {
    id: brandedUuidPk<TServiceId>(),
    propertyId: uuid("property_id")
      .notNull()
      .$type<PropertyId>()
      .references(() => properties.id, { onDelete: "cascade" }),
    serviceTypeId: uuid("service_type_id")
      .notNull()
      .$type<TServiceTypeId>()
      .references(() => serviceTypes.id, { onDelete: "restrict" }),
    // Optional custom label. NULL means "no custom name" — display falls back to the
    // service type label. Intentionally NOT unique: duplicate names are legitimate.
    name: text("name"),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    // No uniqueness on (property, serviceType): multiple active services of the same
    // type per property are permitted (the service model is now dynamic).
    index("services_property_id_idx").on(t.propertyId),
    index("services_deleted_at_idx").on(t.deletedAt),
  ],
);

// --- Exported types ---

export type TService = typeof services.$inferSelect;
export type TNewService = typeof services.$inferInsert;
