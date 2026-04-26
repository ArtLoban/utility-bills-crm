import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Branded nominal type: prevents mixing up plain strings with UserId.
// $type<UserId>() propagates it through Drizzle's inferred query result types.
declare const userIdBrand: unique symbol;
export type UserId = string & { readonly [userIdBrand]: typeof userIdBrand };

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().$type<UserId>(),
    name: text("name"),
    email: text("email").notNull().unique(),
    // Auth.js sets this when a user verifies their email (magic link / OAuth).
    // mode: "date" → Drizzle deserializes to JS Date instead of raw string.
    emailVerified: timestamp("email_verified", {
      mode: "date",
      withTimezone: true,
    }),
    image: text("image"),
    systemRole: text("system_role", { enum: ["user", "admin"] })
      .notNull()
      .default("user"),
    locale: text("locale", { enum: ["en", "uk", "ru"] })
      .notNull()
      .default("en"),
    theme: text("theme", { enum: ["light", "dark", "system"] })
      .notNull()
      .default("system"),
    timezone: text("timezone").notNull().default("Europe/Kyiv"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("users_deleted_at_idx").on(t.deletedAt),
    check("users_system_role_check", sql`${t.systemRole} IN ('user', 'admin')`),
    check("users_locale_check", sql`${t.locale} IN ('en', 'uk', 'ru')`),
    check("users_theme_check", sql`${t.theme} IN ('light', 'dark', 'system')`),
  ],
);

// Each row links one user to one OAuth provider account.
// A user can have multiple accounts (e.g., Google + GitHub in the future).
// OAuth token fields keep snake_case TypeScript names — that is what
// @auth/drizzle-adapter reads when it introspects this table object.
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .$type<UserId>()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("accounts_user_id_idx").on(t.userId),
  ],
);

// One row per active database session.
// sessionToken (random string) is stored in the browser cookie.
// Auth.js queries this table + users on every authenticated request.
// Custom fields: rememberMe and absoluteExpires implement our session policy.
export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .$type<UserId>()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
    rememberMe: boolean("remember_me").notNull().default(false),
    absoluteExpires: timestamp("absolute_expires", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId), index("sessions_expires_idx").on(t.expires)],
);

// Required by the Auth.js adapter interface for magic-link / email flows.
// Empty in MVP; the adapter will never call the related methods in our config.
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export type TUser = typeof users.$inferSelect;
export type TNewUser = typeof users.$inferInsert;
export type TSession = typeof sessions.$inferSelect;
