import { describe, expect, it } from "vitest";

import {
  heatingGcal,
  monthlyConsumption,
  SEED_SERIES,
  winterSeverity,
} from "@/lib/db/seeds/generation";

// Pure, DB-free unit tests for the demo-seed generation core. They pin the two hardest guarantees
// of the slice — calendar-keyed determinism and two genuinely distinct winters — plus the jitter
// and seasonal-shape properties. The pinned floats act as regression guards: if the formula or the
// profile constants change unintentionally, these fail.

const JAN = 0;
const JUL = 6;
const OCT = 9;
const DEC = 11;

describe("monthlyConsumption — determinism", () => {
  it("is a pure function of (series, year, month): repeated calls are identical", () => {
    const a = monthlyConsumption(SEED_SERIES.HOUSE_GAS, 2025, JAN);
    const b = monthlyConsumption(SEED_SERIES.HOUSE_GAS, 2025, JAN);
    expect(a).toBe(b);
  });

  it("produces stable, run-independent values (regression guard against formula drift)", () => {
    expect(monthlyConsumption(SEED_SERIES.APT_COLD_WATER_KITCHEN, 2025, JAN)).toBeCloseTo(
      1.55885,
      5,
    );
    expect(monthlyConsumption(SEED_SERIES.APT_COLD_WATER_BATH, 2025, JAN)).toBeCloseTo(3.373289, 5);
    expect(monthlyConsumption(SEED_SERIES.HOUSE_GAS, 2025, JAN)).toBeCloseTo(272.683576, 5);
  });
});

describe("winterSeverity — two distinct winters", () => {
  it("gives the two winters in the window meaningfully different severities", () => {
    const mild = winterSeverity(2025);
    const cold = winterSeverity(2026);
    expect(mild).toBeCloseTo(0.940426, 5);
    expect(cold).toBeCloseTo(1.093968, 5);
    // Not one template scaled: a clear gap, not floating-point noise.
    expect(Math.abs(cold - mild)).toBeGreaterThan(0.05);
  });

  it("keeps every winter's severity within the [0.90, 1.10) band", () => {
    for (let year = 2000; year < 2100; year++) {
      const severity = winterSeverity(year);
      expect(severity).toBeGreaterThanOrEqual(0.9);
      expect(severity).toBeLessThan(1.1);
    }
  });

  it("feeds the winter severity into heating, so the same December differs across years", () => {
    const decMild = heatingGcal(2024, DEC); // anchor 2025 (mild)
    const decCold = heatingGcal(2025, DEC); // anchor 2026 (cold)
    expect(decMild).toBeCloseTo(1.259922, 5);
    expect(decCold).toBeGreaterThan(decMild);
  });
});

describe("seasonality — calendar-keyed peaks", () => {
  it("puts the house-gas peak in winter, near-zero in summer", () => {
    const january = monthlyConsumption(SEED_SERIES.HOUSE_GAS, 2025, JAN);
    const july = monthlyConsumption(SEED_SERIES.HOUSE_GAS, 2025, JUL);
    expect(january).toBeGreaterThan(july * 10);
  });

  it("zeroes heating outside the season and ramps it inside", () => {
    expect(heatingGcal(2025, JUL)).toBe(0);
    expect(heatingGcal(2025, JAN)).toBeGreaterThan(0);
    // Shoulder (Oct) below deep-winter (Jan) within the same winter (anchor 2025, same severity).
    expect(heatingGcal(2024, OCT)).toBeLessThan(heatingGcal(2025, JAN));
  });
});

describe("jitter — lived-in values", () => {
  it("keeps a value within ±4% of its baseline but off the round figure", () => {
    // APT_COLD_WATER_BATH January baseline is 3.4.
    const value = monthlyConsumption(SEED_SERIES.APT_COLD_WATER_BATH, 2025, JAN);
    expect(value).toBeGreaterThan(3.4 * 0.96);
    expect(value).toBeLessThan(3.4 * 1.04);
    expect(Number.isInteger(value)).toBe(false);
    expect(value).not.toBe(3.4);
  });
});

describe("apartment cold water — two risers, one concept", () => {
  it("sums the two independent risers back into the 4–6 m³ concept target", () => {
    const kitchen = monthlyConsumption(SEED_SERIES.APT_COLD_WATER_KITCHEN, 2025, JAN);
    const bath = monthlyConsumption(SEED_SERIES.APT_COLD_WATER_BATH, 2025, JAN);
    // Independent series (own jitter), not one scaled by a shared factor.
    expect(kitchen).not.toBe(bath);
    const total = kitchen + bath;
    expect(total).toBeGreaterThan(4);
    expect(total).toBeLessThan(6);
  });
});

describe("apartment electricity — night share", () => {
  it("keeps the night zone around 35–40% of the total", () => {
    const day = monthlyConsumption(SEED_SERIES.APT_ELECTRICITY_DAY, 2025, JAN);
    const night = monthlyConsumption(SEED_SERIES.APT_ELECTRICITY_NIGHT, 2025, JAN);
    const nightShare = night / (day + night);
    expect(nightShare).toBeGreaterThan(0.33);
    expect(nightShare).toBeLessThan(0.41);
  });
});
