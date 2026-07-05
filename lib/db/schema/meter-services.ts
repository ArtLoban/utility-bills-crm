import { sql } from "drizzle-orm";
import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { type MeterId, meters } from "./meters";
import { type TServiceId, services } from "./services";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const meterServiceIdBrand: unique symbol;
export type MeterServiceId = string & {
  readonly [meterServiceIdBrand]: typeof meterServiceIdBrand;
};

// --- Table ---
// Explicit many-to-many link between meters and services. One meter may feed several services
// (e.g. water supply + drainage read off a single meter); one service may be fed by several
// meters (e.g. two water meters on one property). Supersedes the implicit "match by shared
// service type" — introduced inert in Slice B1, consumers migrate onto it in later slices.
//
// No temporal interval: a meter already carries time via its own [validFrom, validTo); the link
// is a plain association, soft-deleted when it ends — same convention as property_access, not the
// temporal pattern of meters/tariffs.

export const meterServices = pgTable(
  "meter_services",
  {
    id: brandedUuidPk<MeterServiceId>(),
    meterId: uuid("meter_id")
      .notNull()
      .$type<MeterId>()
      .references(() => meters.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .$type<TServiceId>()
      .references(() => services.id, { onDelete: "cascade" }),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    // One active link per (meter, service) pair. Partial so a soft-deleted link doesn't block
    // re-linking the same pair later.
    uniqueIndex("meter_services_meter_id_service_id_unique_idx")
      .on(t.meterId, t.serviceId)
      .where(sql`${t.deletedAt} IS NULL`),
    index("meter_services_meter_id_idx").on(t.meterId),
    index("meter_services_service_id_idx").on(t.serviceId),
    index("meter_services_deleted_at_idx").on(t.deletedAt),
  ],
);

// --- Exported types ---

export type TMeterService = typeof meterServices.$inferSelect;
export type TNewMeterService = typeof meterServices.$inferInsert;
