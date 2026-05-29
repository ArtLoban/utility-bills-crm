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
