import { sql } from "drizzle-orm";
import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

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
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    // Partial index: one active service per (property, serviceType).
    // Same pattern as property_access: soft-deleted rows don't block re-adding the same service.
    uniqueIndex("services_property_service_type_unique_idx")
      .on(t.propertyId, t.serviceTypeId)
      .where(sql`${t.deletedAt} IS NULL`),
    index("services_property_id_idx").on(t.propertyId),
    index("services_deleted_at_idx").on(t.deletedAt),
  ],
);

// --- Exported types ---

export type TService = typeof services.$inferSelect;
export type TNewService = typeof services.$inferInsert;
