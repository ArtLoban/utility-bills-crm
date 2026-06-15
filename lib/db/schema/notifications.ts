import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { type UserId, users } from "./auth";
import { type TServiceId, services } from "./services";
import { brandedUuidPk, textEnum, timestamps } from "./helpers";

// --- Branded type ---

declare const reminderIdBrand: unique symbol;
export type ReminderId = string & { readonly [reminderIdBrand]: typeof reminderIdBrand };

// --- Enum const-objects (canonical source for column + CHECK constraint + domain logic) ---

export const REMINDER_ANCHOR_TYPES = {
  DAY_OF_MONTH: "day_of_month",
  DAYS_BEFORE_END: "days_before_end",
} as const;

export type TReminderAnchorType =
  (typeof REMINDER_ANCHOR_TYPES)[keyof typeof REMINDER_ANCHOR_TYPES];

export const REMINDER_ANCHOR_TYPE_LIST = [
  REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
  REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
] as const;

// --- Table ---
// Hard-delete (no softDelete): a reminder is personal configuration with no audit value
// and no incoming foreign keys — a deliberate exception to the project's soft-delete norm.
// A reminder belongs to a (user × service) pair; one service can hold many. No uniqueness
// constraint — duplicate reminders are the user's own responsibility.

export const reminders = pgTable(
  "reminders",
  {
    id: brandedUuidPk<ReminderId>(),
    userId: uuid("user_id")
      .notNull()
      .$type<UserId>()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .$type<TServiceId>()
      .references(() => services.id, { onDelete: "cascade" }),
    anchorType: textEnum("anchor_type", REMINDER_ANCHOR_TYPE_LIST).notNull(),
    anchorValue: integer("anchor_value").notNull(),
    text: text("text").notNull(),
    ...timestamps(),
  },
  (t) => [
    index("reminders_user_id_idx").on(t.userId),
    index("reminders_service_id_idx").on(t.serviceId),
    check(
      "reminders_anchor_type_check",
      sql`${t.anchorType} IN ('day_of_month', 'days_before_end')`,
    ),
    // anchorValue range is conditioned on anchorType: day_of_month → 1..31, days_before_end → 0..27.
    check(
      "reminders_anchor_value_range_check",
      sql`(${t.anchorType} = 'day_of_month' AND ${t.anchorValue} BETWEEN 1 AND 31) OR (${t.anchorType} = 'days_before_end' AND ${t.anchorValue} BETWEEN 0 AND 27)`,
    ),
    check("reminders_text_len_check", sql`char_length(btrim(${t.text})) BETWEEN 1 AND 280`),
  ],
);

// --- Exported types ---

export type TReminder = typeof reminders.$inferSelect;
export type TNewReminder = typeof reminders.$inferInsert;
