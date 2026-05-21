import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { brandedUuidPk, softDelete, textEnum, timestamps } from "./helpers";

// --- Branded types ---

declare const propertyIdBrand: unique symbol;
export type PropertyId = string & { readonly [propertyIdBrand]: typeof propertyIdBrand };

declare const propertyAccessIdBrand: unique symbol;
export type PropertyAccessId = string & {
  readonly [propertyAccessIdBrand]: typeof propertyAccessIdBrand;
};

// --- Enum value tuples (single source of truth for column + CHECK constraint) ---

export const PROPERTY_TYPES = ["apartment", "house", "cottage", "other"] as const;
export type TPropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_ROLES = ["owner", "editor", "viewer"] as const;
export type TPropertyRole = (typeof PROPERTY_ROLES)[number];

// --- Tables ---

export const properties = pgTable(
  "properties",
  {
    id: brandedUuidPk<PropertyId>(),
    name: text("name").notNull(),
    type: textEnum("type", PROPERTY_TYPES).notNull(),
    address: text("address"),
    notes: text("notes"),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    index("properties_deleted_at_idx").on(t.deletedAt),
    check("properties_type_check", sql`${t.type} IN ('apartment', 'house', 'cottage', 'other')`),
  ],
);

export const propertyAccess = pgTable(
  "property_access",
  {
    id: brandedUuidPk<PropertyAccessId>(),
    propertyId: uuid("property_id")
      .notNull()
      .$type<PropertyId>()
      .references(() => properties.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .$type<UserId>()
      .references(() => users.id, { onDelete: "cascade" }),
    propertyRole: textEnum("property_role", PROPERTY_ROLES).notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    // Nullable: granter becomes unknown if their account is deleted (ON DELETE SET NULL)
    grantedBy: uuid("granted_by")
      .$type<UserId>()
      .references(() => users.id, { onDelete: "set null" }),
    ...timestamps(),
    ...softDelete(),
  },
  (t) => [
    // Partial index: one active role per user per property.
    // Must be partial so a soft-deleted row doesn't block re-inviting the same user.
    uniqueIndex("property_access_property_user_unique_idx")
      .on(t.propertyId, t.userId)
      .where(sql`${t.deletedAt} IS NULL`),
    index("property_access_user_id_idx").on(t.userId),
    index("property_access_property_id_idx").on(t.propertyId),
    index("property_access_deleted_at_idx").on(t.deletedAt),
    check("property_access_role_check", sql`${t.propertyRole} IN ('owner', 'editor', 'viewer')`),
  ],
);

// --- Exported types ---

export type TProperty = typeof properties.$inferSelect;
export type TNewProperty = typeof properties.$inferInsert;
export type TPropertyAccess = typeof propertyAccess.$inferSelect;
export type TNewPropertyAccess = typeof propertyAccess.$inferInsert;
