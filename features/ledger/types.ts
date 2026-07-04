import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceTypeCode } from "@/features/services/service-type";

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

// Monthly expense aggregation (Decision #146, extended in Slice 4).
// Series identity depends on the service type:
//   - regular types are grouped by service_types.code — multiple service instances of the
//     same type (e.g. electricity in two properties) sum into one row per type;
//   - `other` services each form their own row, identified by the service itself, so
//     heterogeneous custom services (a garage, a subscription) stay distinct.
// `key` is that identity (type code | service id) and drives the chart dataKey/color/legend.
// monthlyAmounts is index-aligned to months; 0 for months with no bills.

// What a series stands for: a whole service type, or one specific custom (`other`) service.
export type TExpenseSeriesIdentity =
  | { kind: "type"; code: TServiceTypeCode }
  | { kind: "custom"; serviceId: TServiceId; name: string | null };

export type TServiceExpenseRow = {
  key: string;
  monthlyAmounts: number[];
} & TExpenseSeriesIdentity;

export type TMonthlyExpensesAggregate = {
  months: string[]; // "YYYY-MM-DD" first-of-month, ordered
  services: TServiceExpenseRow[];
};
