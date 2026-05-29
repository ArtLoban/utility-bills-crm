import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TBalance, TExpectedAmount, TReadingPair } from "./types";

// Decision #107 sign convention:
//   balance > 0 → debt   → destructive color
//   balance < 0 → overpayment → green color
//   balance = 0 → settled    → neutral color
export const computeBalance = (billsSum: string | null, paymentsSum: string | null): TBalance => {
  const billsTotal = parseFloat(billsSum ?? "0");
  const paymentsTotal = parseFloat(paymentsSum ?? "0");
  return { billsTotal, paymentsTotal, balance: billsTotal - paymentsTotal };
};

// Half-open [validFrom, validTo) temporal tariff lookup.
// periodStart: "YYYY-MM-DD" string (Drizzle `date` column) — interpreted as UTC midnight.
// Tariffs must be sorted by validFrom ASC by the caller (query layer always ensures this).
export const findTariffForPeriod = (tariffs: TTariff[], periodStart: string): TTariff | null => {
  const ref = new Date(periodStart + "T00:00:00Z");
  return tariffs.find((t) => t.validFrom <= ref && (t.validTo === null || t.validTo > ref)) ?? null;
};

export const computeExpectedFixed = (tariff: TTariff): TExpectedAmount => {
  if (tariff.fixedAmount === null) return { kind: "cannot-compute", reason: "no-tariff" };
  return { kind: "computed", amount: parseFloat(tariff.fixedAmount) };
};

export const computeExpectedMetered = (
  tariff: TTariff,
  readings: TReadingPair,
): TExpectedAmount => {
  if (!readings.curr || !readings.prev) return { kind: "cannot-compute", reason: "no-reading" };
  if (!tariff.rateT1) return { kind: "cannot-compute", reason: "no-tariff" };

  const consumptionT1 = parseFloat(readings.curr.valueT1) - parseFloat(readings.prev.valueT1);
  let amount = consumptionT1 * parseFloat(tariff.rateT1);

  if (tariff.rateT2 !== null && readings.curr.valueT2 !== null && readings.prev.valueT2 !== null) {
    const consumptionT2 = parseFloat(readings.curr.valueT2) - parseFloat(readings.prev.valueT2);
    amount += consumptionT2 * parseFloat(tariff.rateT2);
  }

  if (tariff.rateT3 !== null && readings.curr.valueT3 !== null && readings.prev.valueT3 !== null) {
    const consumptionT3 = parseFloat(readings.curr.valueT3) - parseFloat(readings.prev.valueT3);
    amount += consumptionT3 * parseFloat(tariff.rateT3);
  }

  return { kind: "computed", amount };
};
