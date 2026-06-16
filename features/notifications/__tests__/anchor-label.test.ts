import { describe, expect, it } from "vitest";

import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import { describeReminderAnchor } from "../anchor-label";

describe("describeReminderAnchor", () => {
  it("describes a day_of_month anchor by its day", () => {
    expect(
      describeReminderAnchor({ anchorType: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH, anchorValue: 15 }),
    ).toEqual({
      kind: "dayOfMonth",
      day: 15,
    });
  });

  it("collapses days_before_end value 0 to the last day", () => {
    expect(
      describeReminderAnchor({ anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END, anchorValue: 0 }),
    ).toEqual({
      kind: "lastDay",
    });
  });

  it("describes a positive days_before_end anchor by its offset", () => {
    expect(
      describeReminderAnchor({ anchorType: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END, anchorValue: 3 }),
    ).toEqual({
      kind: "daysBeforeEnd",
      days: 3,
    });
  });
});
