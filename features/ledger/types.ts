import type { TReading } from "@/lib/db/schema/readings";

// Sign convention (Decision #107):
//   balance > 0 → debt (user owes more than paid)  → destructive color
//   balance < 0 → overpayment (paid more than owed) → green color
//   balance = 0 → settled                           → neutral color
export type TBalance = {
  billsTotal: number;
  paymentsTotal: number;
  balance: number; // billsTotal - paymentsTotal
};

export type TExpectedAmount =
  | { kind: "computed"; amount: number }
  | { kind: "cannot-compute"; reason: "no-tariff" | "no-reading" };

export type TReadingPair = {
  prev: TReading | null;
  curr: TReading | null;
};

// Monthly expense aggregation (Decision #146).
// Grouped by service_types.code — multiple service instances of the same type
// (e.g., electricity in two properties) are summed into one row per type.
// months: ordered "YYYY-MM-DD" first-of-month strings covering the full requested range.
// monthlyAmounts is index-aligned to months; 0 for months with no bills.
export type TServiceExpenseRow = {
  code: string; // service_types.code, e.g. "electricity"
  monthlyAmounts: number[];
};

export type TMonthlyExpensesAggregate = {
  months: string[]; // "YYYY-MM-DD" first-of-month, ordered
  services: TServiceExpenseRow[];
};
