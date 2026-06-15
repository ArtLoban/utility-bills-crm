import { describe, expect, it } from "vitest";

import type { TDueReminderBlock, TTranslateService } from "../digest";
import { buildDigest } from "../digest";

// Fake translator — uppercases the code so the substitution point is visible in assertions.
// The real (locale-bound) translator is exercised in the delivery integration test.
const translateService: TTranslateService = (code) => `SVC:${code}`;

const block = (propertyName: string, serviceTypeCode: string, text: string): TDueReminderBlock => ({
  propertyName,
  serviceTypeCode,
  text,
});

describe("buildDigest", () => {
  it("renders a single block as header line + user text", () => {
    const result = buildDigest(
      [block("Home", "electricity", "Submit the meter reading")],
      translateService,
    );

    expect(result).toBe("[Home · SVC:electricity]\nSubmit the meter reading");
  });

  it("combines multiple due reminders into one message separated by a blank line", () => {
    const result = buildDigest(
      [
        block("Home", "electricity", "Submit the meter reading"),
        block("Cottage", "gas", "Pay the bill"),
      ],
      translateService,
    );

    expect(result).toBe(
      "[Home · SVC:electricity]\nSubmit the meter reading\n\n[Cottage · SVC:gas]\nPay the bill",
    );
  });

  it("translates each block's service through the injected translator", () => {
    const result = buildDigest([block("Flat", "hot_water", "Note")], (code) => `<${code}>`);

    expect(result).toContain("[Flat · <hot_water>]");
  });

  it("returns an empty string for no blocks (a user with nothing due is not sent)", () => {
    expect(buildDigest([], translateService)).toBe("");
  });
});
