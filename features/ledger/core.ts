import type { TReading } from "@/lib/db/schema/readings";
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

// Expected metered amount across every meter feeding the service (one reading pair per meter).
// Rates are linear, so summing each meter's consumption × rate equals rate × total consumption —
// the hint stays consistent with monthlyConsumptionByService, which likewise sums per-meter deltas.
// A pair contributes only when it has both readings; a meter with fewer than two readings is skipped.
export const computeExpectedMetered = (
  tariff: TTariff,
  readingPairs: TReadingPair[],
): TExpectedAmount => {
  const usable = readingPairs.filter(
    (pair): pair is { curr: TReading; prev: TReading } => pair.curr !== null && pair.prev !== null,
  );
  if (usable.length === 0) return { kind: "cannot-compute", reason: "no-reading" };
  if (!tariff.rateT1) return { kind: "cannot-compute", reason: "no-tariff" };

  let amount = 0;
  for (const { curr, prev } of usable) {
    amount += (parseFloat(curr.valueT1) - parseFloat(prev.valueT1)) * parseFloat(tariff.rateT1);

    if (tariff.rateT2 !== null && curr.valueT2 !== null && prev.valueT2 !== null) {
      amount += (parseFloat(curr.valueT2) - parseFloat(prev.valueT2)) * parseFloat(tariff.rateT2);
    }

    if (tariff.rateT3 !== null && curr.valueT3 !== null && prev.valueT3 !== null) {
      amount += (parseFloat(curr.valueT3) - parseFloat(prev.valueT3)) * parseFloat(tariff.rateT3);
    }
  }

  return { kind: "computed", amount };
};
