import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { toIsoDate } from "@/lib/format/date";

export type TPieEntry = { key: string; total: number };
export type TPivotRow = Record<string, string | number>;

// Sum each series over the full range. Series with total 0 are excluded
// (they add nothing to the pie and clutter the legend). Keyed by series identity
// (`key`): type code for regular types, service id for custom `other` services.
export const toPieData = (agg: TMonthlyExpensesAggregate): TPieEntry[] =>
  agg.services
    .map((s) => ({
      key: s.key,
      total: s.monthlyAmounts.reduce((sum, n) => sum + n, 0),
    }))
    .filter((e) => e.total > 0);

// Pivot to one row per month with a field per series key.
// Used by both BarChart and LineChart — same row-per-month format.
export const toBarData = (agg: TMonthlyExpensesAggregate): TPivotRow[] =>
  agg.months.map((month, i) => {
    const row: TPivotRow = { month };
    for (const s of agg.services) {
      row[s.key] = s.monthlyAmounts[i] ?? 0;
    }
    return row;
  });

// Alias: LineChart reads the same pivot shape as BarChart.
export const toLineData = toBarData;

// Computes the "last 12 months" default date range.
// dateFrom = first of the month 12 months ago (UTC).
// dateTo = first of the current month (UTC), so the current (partial) month is always shown.
export const resolveDefaultDateRange = (): { dateFrom: string; dateTo: string } => {
  const now = new Date();
  const dateTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const dateFrom = new Date(dateTo);
  dateFrom.setUTCMonth(dateFrom.getUTCMonth() - 11);
  return {
    dateFrom: toIsoDate(dateFrom),
    dateTo: toIsoDate(dateTo),
  };
};
