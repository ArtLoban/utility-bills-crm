import { describe, expect, it } from "vitest";

import type { TTariffId } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import type { MeterId } from "@/lib/db/schema/meters";
import type { UserId } from "@/lib/db/schema/auth";
import {
  computeBalance,
  computeExpectedFixed,
  computeExpectedMetered,
  findTariffForPeriod,
} from "../core";

// --- Fixture helpers ---

const makeTariff = (overrides: Partial<TTariff> = {}): TTariff => ({
  id: "tid" as TTariffId,
  contractId: "cid" as TContractId,
  rateT1: null,
  rateT2: null,
  rateT3: null,
  fixedAmount: null,
  validFrom: new Date("2024-01-01T00:00:00Z"),
  validTo: null,
  notes: null,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
  deletedAt: null,
  ...overrides,
});

const makeReading = (overrides: Partial<TReading> = {}): TReading => ({
  id: "rid" as ReadingId,
  meterId: "mid" as MeterId,
  readAt: new Date("2024-04-30T12:00:00Z"),
  valueT1: "1000.000",
  valueT2: null,
  valueT3: null,
  notes: null,
  createdBy: "uid" as UserId,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
});

// --- computeBalance ---

describe("computeBalance", () => {
  it("returns zero balance when both sums are null (no bills, no payments)", () => {
    expect(computeBalance(null, null)).toEqual({ billsTotal: 0, paymentsTotal: 0, balance: 0 });
  });

  it("returns positive balance (debt) when bills exceed payments", () => {
    expect(computeBalance("500.00", null)).toEqual({
      billsTotal: 500,
      paymentsTotal: 0,
      balance: 500,
    });
  });

  it("returns negative balance (overpayment) when payments exceed bills", () => {
    expect(computeBalance("200.00", "350.00")).toEqual({
      billsTotal: 200,
      paymentsTotal: 350,
      balance: -150,
    });
  });

  it("returns zero balance when bills and payments are equal (settled)", () => {
    expect(computeBalance("300.00", "300.00")).toEqual({
      billsTotal: 300,
      paymentsTotal: 300,
      balance: 0,
    });
  });

  it("handles null payments with non-null bills", () => {
    const result = computeBalance("1234.56", null);
    expect(result.balance).toBeCloseTo(1234.56);
    expect(result.paymentsTotal).toBe(0);
  });
});

// --- findTariffForPeriod ---
// Tariff A: [2024-01-01, 2024-04-01)  — valid Jan–Mar
// Tariff B: [2024-04-01, null)         — valid from Apr onwards

describe("findTariffForPeriod", () => {
  const tariffA = makeTariff({
    id: "tariff-a" as TTariffId,
    fixedAmount: "100.00",
    validFrom: new Date("2024-01-01T00:00:00Z"),
    validTo: new Date("2024-04-01T00:00:00Z"),
  });

  const tariffB = makeTariff({
    id: "tariff-b" as TTariffId,
    fixedAmount: "120.00",
    validFrom: new Date("2024-04-01T00:00:00Z"),
    validTo: null,
  });

  const tariffs = [tariffA, tariffB];

  it("returns tariff A when period is at validFrom boundary (inclusive)", () => {
    expect(findTariffForPeriod(tariffs, "2024-01-01")).toEqual(tariffA);
  });

  it("returns tariff A for a date well within its range", () => {
    expect(findTariffForPeriod(tariffs, "2024-03-01")).toEqual(tariffA);
  });

  it("returns tariff A for the last day before the boundary", () => {
    expect(findTariffForPeriod(tariffs, "2024-03-31")).toEqual(tariffA);
  });

  it("returns tariff B at exactly the validTo boundary of A (exclusive end → new tariff starts)", () => {
    // 2024-04-01 is tariff A's validTo (exclusive) and tariff B's validFrom (inclusive)
    expect(findTariffForPeriod(tariffs, "2024-04-01")).toEqual(tariffB);
  });

  it("returns tariff B for a date within its open-ended range", () => {
    expect(findTariffForPeriod(tariffs, "2024-04-15")).toEqual(tariffB);
  });

  it("returns tariff B far in the future (open-ended range)", () => {
    expect(findTariffForPeriod(tariffs, "2025-06-01")).toEqual(tariffB);
  });

  it("returns null when period is before any tariff", () => {
    expect(findTariffForPeriod(tariffs, "2023-12-31")).toBeNull();
  });

  it("returns null for an empty tariff list", () => {
    expect(findTariffForPeriod([], "2024-01-01")).toBeNull();
  });

  it("handles a single open-ended tariff covering far-future dates", () => {
    const single = [makeTariff({ validFrom: new Date("2024-01-01T00:00:00Z"), validTo: null })];
    expect(findTariffForPeriod(single, "2030-01-01")).not.toBeNull();
  });

  it("returns null for a period after a closed tariff (validTo in the past)", () => {
    const closed = [
      makeTariff({
        validFrom: new Date("2024-01-01T00:00:00Z"),
        validTo: new Date("2024-06-01T00:00:00Z"),
      }),
    ];
    expect(findTariffForPeriod(closed, "2024-06-01")).toBeNull();
  });
});

// --- computeExpectedFixed ---

describe("computeExpectedFixed", () => {
  it("returns the fixedAmount as a computed result", () => {
    const tariff = makeTariff({ fixedAmount: "450.75" });
    expect(computeExpectedFixed(tariff)).toEqual({ kind: "computed", amount: 450.75 });
  });

  it("returns cannot-compute when fixedAmount is null", () => {
    const tariff = makeTariff({ fixedAmount: null });
    expect(computeExpectedFixed(tariff)).toEqual({
      kind: "cannot-compute",
      reason: "no-tariff",
    });
  });
});

// --- computeExpectedMetered ---

describe("computeExpectedMetered", () => {
  const tariffT1Only = makeTariff({ rateT1: "4.3200" });
  const tariffT1T2 = makeTariff({ rateT1: "4.3200", rateT2: "2.1600" });

  it("returns cannot-compute when curr reading is missing", () => {
    expect(computeExpectedMetered(tariffT1Only, { curr: null, prev: makeReading() })).toEqual({
      kind: "cannot-compute",
      reason: "no-reading",
    });
  });

  it("returns cannot-compute when prev reading is missing", () => {
    expect(computeExpectedMetered(tariffT1Only, { curr: makeReading(), prev: null })).toEqual({
      kind: "cannot-compute",
      reason: "no-reading",
    });
  });

  it("returns cannot-compute when tariff has no rateT1", () => {
    const tariffNoRate = makeTariff({ rateT1: null });
    expect(
      computeExpectedMetered(tariffNoRate, {
        curr: makeReading(),
        prev: makeReading({ valueT1: "900.000" }),
      }),
    ).toEqual({ kind: "cannot-compute", reason: "no-tariff" });
  });

  it("computes single-zone consumption correctly", () => {
    const prev = makeReading({ valueT1: "900.000" });
    const curr = makeReading({ valueT1: "1000.000" }); // consumption = 100 kWh
    const result = computeExpectedMetered(tariffT1Only, { curr, prev });
    expect(result).toEqual({ kind: "computed", amount: 100 * 4.32 });
  });

  it("computes multi-zone consumption (T1 + T2) correctly", () => {
    const prev = makeReading({ valueT1: "900.000", valueT2: "200.000" });
    const curr = makeReading({ valueT1: "1000.000", valueT2: "250.000" });
    // T1: 100 × 4.32 = 432, T2: 50 × 2.16 = 108 → total = 540
    const result = computeExpectedMetered(tariffT1T2, { curr, prev });
    expect(result.kind).toBe("computed");
    if (result.kind === "computed") {
      expect(result.amount).toBeCloseTo(540, 5);
    }
  });

  it("falls back to T1 only when T2 reading values are null (single-zone meter, two-zone tariff)", () => {
    const prev = makeReading({ valueT1: "900.000", valueT2: null });
    const curr = makeReading({ valueT1: "1000.000", valueT2: null });
    const result = computeExpectedMetered(tariffT1T2, { curr, prev });
    // Only T1 counts when valueT2 is null
    expect(result).toEqual({ kind: "computed", amount: 100 * 4.32 });
  });
});
