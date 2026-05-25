import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { type ProviderId, providers } from "./providers";
import { type TServiceId, services } from "./services";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const contractIdBrand: unique symbol;
export type TContractId = string & { readonly [contractIdBrand]: typeof contractIdBrand };

// --- Table ---
// Half-open temporal interval [validFrom, validTo). validTo = NULL means "still current".
// Exclusion constraint (contracts_no_overlap_excl) is NOT expressed in this Drizzle definition
// because Drizzle does not support EXCLUDE USING gist. It is applied manually in the migration SQL.

export const contracts = pgTable(
  "contracts",
  {
    id: brandedUuidPk<TContractId>(),
    serviceId: uuid("service_id")
      .notNull()
      .$type<TServiceId>()
      .references(() => services.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id")
      .notNull()
      .$type<ProviderId>()
      .references(() => providers.id, { onDelete: "restrict" }),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validTo: timestamp("valid_to", { withTimezone: true }),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("contracts_service_id_valid_from_idx").on(t.serviceId, t.validFrom),
    index("contracts_provider_id_idx").on(t.providerId),
    index("contracts_deleted_at_idx").on(t.deletedAt),
    check("contracts_valid_to_check", sql`${t.validTo} IS NULL OR ${t.validTo} > ${t.validFrom}`),
  ],
);

// --- Exported types ---

export type TContract = typeof contracts.$inferSelect;
export type TNewContract = typeof contracts.$inferInsert;
