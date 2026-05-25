import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { brandedUuidPk, softDelete, timestamps } from "./helpers";

// --- Branded type ---

declare const providerIdBrand: unique symbol;
export type ProviderId = string & { readonly [providerIdBrand]: typeof providerIdBrand };

// --- Table ---

export const providers = pgTable(
  "providers",
  {
    id: brandedUuidPk<ProviderId>(),
    name: text("name").notNull(),
    website: text("website"),
    phone: text("phone"),
    notes: text("notes"),
    ownerId: uuid("owner_id")
      .notNull()
      .$type<UserId>()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("providers_owner_id_idx").on(t.ownerId),
    index("providers_deleted_at_idx").on(t.deletedAt),
  ],
);

// --- Exported types ---

export type TProvider = typeof providers.$inferSelect;
export type TNewProvider = typeof providers.$inferInsert;
