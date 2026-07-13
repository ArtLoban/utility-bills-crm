import { describe, expect, it } from "vitest";

import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceTypeCode } from "@/features/services/service-type";

import { resolveDefaultDateRange, toBarData, toLineData, toPieData } from "../chart-transforms";

// Fake branded service id for fixtures.
const sid = (v: string): TServiceId => v as TServiceId;

// --- Fixtures ---

// Regular-type series: key === code, so the pivot/pie key by "electricity", "gas", …
const makeAggregate = (
  months: string[],
  services: { code: string; amounts: number[] }[],
): TMonthlyExpensesAggregate => ({
  months,
  services: services.map((s) => ({
    kind: "type",
    key: s.code,
    code: s.code as TServiceTypeCode,
    monthlyAmounts: s.amounts,
  })),
});

// --- toPieData ---

describe("toPieData", () => {
  it("sums monthlyAmounts for each service", () => {
    const agg = makeAggregate(
      ["2025-01-01", "2025-02-01"],
      [
        { code: "electricity", amounts: [100, 120] },
        { code: "gas", amounts: [200, 250] },
      ],
    );
    const pie = toPieData(agg);
    expect(pie).toEqual([
      { key: "electricity", total: 220 },
      { key: "gas", total: 450 },
    ]);
  });

  it("excludes services with total 0", () => {
    const agg = makeAggregate(
      ["2025-01-01"],
      [
        { code: "electricity", amounts: [0] },
        { code: "gas", amounts: [300] },
      ],
    );
    const pie = toPieData(agg);
    expect(pie).toHaveLength(1);
    expect(pie[0]!.key).toBe("gas");
  });

  it("returns empty array for empty aggregate", () => {
    const agg = makeAggregate(["2025-01-01"], []);
    expect(toPieData(agg)).toEqual([]);
  });
});

// --- toBarData / toLineData ---

describe("toBarData", () => {
  it("returns one row per month", () => {
    const agg = makeAggregate(
      ["2025-01-01", "2025-02-01", "2025-03-01"],
      [{ code: "electricity", amounts: [100, 120, 140] }],
    );
    const rows = toBarData(agg);
    expect(rows).toHaveLength(3);
  });

  it("pivots service amounts into month rows", () => {
    const agg = makeAggregate(
      ["2025-01-01", "2025-02-01"],
      [
        { code: "electricity", amounts: [100, 120] },
        { code: "gas", amounts: [200, 250] },
      ],
    );
    const rows = toBarData(agg);
    expect(rows[0]).toEqual({ month: "2025-01-01", electricity: 100, gas: 200 });
    expect(rows[1]).toEqual({ month: "2025-02-01", electricity: 120, gas: 250 });
  });

  it("fills 0 for missing amounts (gap months)", () => {
    const agg = makeAggregate(["2025-01-01", "2025-02-01"], [{ code: "gas", amounts: [300, 0] }]);
    const rows = toBarData(agg);
    expect(rows[1]!.gas).toBe(0);
  });
});

describe("toLineData", () => {
  it("is the same transform as toBarData", () => {
    const agg = makeAggregate(["2025-01-01"], [{ code: "electricity", amounts: [100] }]);
    expect(toLineData(agg)).toEqual(toBarData(agg));
  });
});

// --- custom `other` series keying (Slice 4) ---

describe("custom `other` series keying", () => {
  it("keys pie entries and pivot fields by service id, not by the 'other' code", () => {
    const agg: TMonthlyExpensesAggregate = {
      months: ["2025-01-01"],
      services: [
        {
          kind: "custom",
          key: "svc-1",
          serviceId: sid("svc-1"),
          name: "Garage",
          monthlyAmounts: [50],
        },
        {
          kind: "custom",
          key: "svc-2",
          serviceId: sid("svc-2"),
          name: "Storage",
          monthlyAmounts: [30],
        },
      ],
    };

    expect(toPieData(agg)).toEqual([
      { key: "svc-1", total: 50 },
      { key: "svc-2", total: 30 },
    ]);
    expect(toBarData(agg)[0]).toEqual({ month: "2025-01-01", "svc-1": 50, "svc-2": 30 });
  });
});

// --- resolveDefaultDateRange ---

describe("resolveDefaultDateRange", () => {
  it("returns dateFrom 11 months before dateTo (12-month span including current month)", () => {
    const { dateFrom, dateTo } = resolveDefaultDateRange();
    const from = new Date(dateFrom + "T00:00:00Z");
    const to = new Date(dateTo + "T00:00:00Z");
    // Difference must be exactly 11 calendar months
    const monthDiff =
      (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
    expect(monthDiff).toBe(11);
  });

  it("dateFrom is the first of a month", () => {
    const { dateFrom } = resolveDefaultDateRange();
    expect(dateFrom.endsWith("-01")).toBe(true);
  });

  it("dateTo is the first of a month (current month)", () => {
    const { dateTo } = resolveDefaultDateRange();
    expect(dateTo.endsWith("-01")).toBe(true);
  });

  it("dateTo matches the current UTC year-month", () => {
    const { dateTo } = resolveDefaultDateRange();
    const now = new Date();
    const expectedYearMonth =
      `${now.getUTCFullYear()}-` + `${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    expect(dateTo.startsWith(expectedYearMonth)).toBe(true);
  });
});
