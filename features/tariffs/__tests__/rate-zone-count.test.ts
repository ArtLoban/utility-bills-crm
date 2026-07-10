import { describe, expect, it } from "vitest";

import { rateZoneCountFor } from "../rate-zone-count";

const metered = { measurementType: "metered", supportsZones: true } as const;

describe("rateZoneCountFor (decision #2)", () => {
  it("uses the meter zone count for a metered, zone-supporting service", () => {
    expect(rateZoneCountFor(metered, { zoneCount: 2 })).toBe(2);
    expect(rateZoneCountFor(metered, { zoneCount: 3 })).toBe(3);
  });

  it("falls back to a single rate when there is no meter yet", () => {
    expect(rateZoneCountFor(metered, null)).toBe(1);
  });

  it("is single-rate when the service type does not support zones", () => {
    expect(
      rateZoneCountFor({ measurementType: "metered", supportsZones: false }, { zoneCount: 3 }),
    ).toBe(1);
  });

  it("is single-rate for a fixed (non-metered) service", () => {
    expect(
      rateZoneCountFor({ measurementType: "fixed", supportsZones: true }, { zoneCount: 3 }),
    ).toBe(1);
  });
});
