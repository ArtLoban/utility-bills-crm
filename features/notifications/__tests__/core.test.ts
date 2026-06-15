import { describe, expect, it } from "vitest";

import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import type { TCivilDate, TReminderAnchor } from "../core";
import { reminderFiresOn } from "../core";

// --- Fixture helpers ---

const dayOfMonth = (anchorValue: number): TReminderAnchor => ({
  anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
  anchorValue,
});

const daysBeforeEnd = (anchorValue: number): TReminderAnchor => ({
  anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
  anchorValue,
});

// Month lengths exercised across the suite:
//   Feb 2025 → 28 (common year), Feb 2024 → 29 (leap year),
//   Apr 2025 → 30, Jan 2025 → 31.
const date = (year: number, month: number, day: number): TCivilDate => ({ year, month, day });

// --- day_of_month ---

describe("reminderFiresOn — day_of_month", () => {
  it("fires on the exact target day", () => {
    expect(reminderFiresOn(dayOfMonth(15), date(2025, 1, 15))).toBe(true);
  });

  it("does not fire on any other day of the month", () => {
    expect(reminderFiresOn(dayOfMonth(15), date(2025, 1, 14))).toBe(false);
    expect(reminderFiresOn(dayOfMonth(15), date(2025, 1, 16))).toBe(false);
  });

  it("fires on the 1st when value is 1", () => {
    expect(reminderFiresOn(dayOfMonth(1), date(2025, 1, 1))).toBe(true);
  });

  it("clamps to the last day of a 30-day month (value 31 → Apr 30)", () => {
    expect(reminderFiresOn(dayOfMonth(31), date(2025, 4, 30))).toBe(true);
    expect(reminderFiresOn(dayOfMonth(31), date(2025, 4, 29))).toBe(false);
  });

  it("clamps to the last day of a common-year February (value 31 → Feb 28)", () => {
    expect(reminderFiresOn(dayOfMonth(31), date(2025, 2, 28))).toBe(true);
    expect(reminderFiresOn(dayOfMonth(31), date(2025, 2, 27))).toBe(false);
  });

  it("clamps to the last day of a leap-year February (value 31 → Feb 29)", () => {
    expect(reminderFiresOn(dayOfMonth(31), date(2024, 2, 29))).toBe(true);
    expect(reminderFiresOn(dayOfMonth(31), date(2024, 2, 28))).toBe(false);
  });

  it("clamps value 30 to Feb 28 in a common year, but value 30 fires plainly in April", () => {
    expect(reminderFiresOn(dayOfMonth(30), date(2025, 2, 28))).toBe(true);
    expect(reminderFiresOn(dayOfMonth(30), date(2025, 4, 30))).toBe(true);
  });

  it("does not fire on day 31 of a 31-day month when value is clamped from a shorter month context only", () => {
    // value 31 in a 31-day month fires on the 31st (no clamp needed).
    expect(reminderFiresOn(dayOfMonth(31), date(2025, 1, 31))).toBe(true);
  });
});

// --- days_before_end ---

describe("reminderFiresOn — days_before_end", () => {
  it("value 0 fires on the last day of a 31-day month", () => {
    expect(reminderFiresOn(daysBeforeEnd(0), date(2025, 1, 31))).toBe(true);
    expect(reminderFiresOn(daysBeforeEnd(0), date(2025, 1, 30))).toBe(false);
  });

  it("value 0 fires on the last day of a common-year February (Feb 28)", () => {
    expect(reminderFiresOn(daysBeforeEnd(0), date(2025, 2, 28))).toBe(true);
  });

  it("value 0 fires on the last day of a leap-year February (Feb 29)", () => {
    expect(reminderFiresOn(daysBeforeEnd(0), date(2024, 2, 29))).toBe(true);
    expect(reminderFiresOn(daysBeforeEnd(0), date(2024, 2, 28))).toBe(false);
  });

  it("value 3 fires on the 25th of a 28-day February (28 − 3)", () => {
    expect(reminderFiresOn(daysBeforeEnd(3), date(2025, 2, 25))).toBe(true);
    expect(reminderFiresOn(daysBeforeEnd(3), date(2025, 2, 26))).toBe(false);
  });

  it("value 3 fires on the 26th of a 29-day February (29 − 3)", () => {
    expect(reminderFiresOn(daysBeforeEnd(3), date(2024, 2, 26))).toBe(true);
  });

  it("value 3 fires on the 28th of a 31-day month (31 − 3)", () => {
    expect(reminderFiresOn(daysBeforeEnd(3), date(2025, 1, 28))).toBe(true);
    expect(reminderFiresOn(daysBeforeEnd(3), date(2025, 1, 27))).toBe(false);
  });

  it("value 27 fires on the 1st of a 28-day February (28 − 27)", () => {
    expect(reminderFiresOn(daysBeforeEnd(27), date(2025, 2, 1))).toBe(true);
  });

  it("value 27 fires on the 4th of a 31-day month (31 − 27)", () => {
    expect(reminderFiresOn(daysBeforeEnd(27), date(2025, 1, 4))).toBe(true);
  });
});
