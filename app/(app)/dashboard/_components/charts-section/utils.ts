import { ROUTES } from "@/lib/routes";
import { toIsoDate } from "@/lib/format/date";

import type { TTooltipRow } from "./components/chart-tooltip-card";

// Format "2025-06-01" → "Jun" for X-axis tick labels.
export const formatMonthLabel = (isoDate: string): string =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

// Format "2025-06-01" → "June 2025" for tooltip headers (full month name + year).
export const formatMonthFull = (isoDate: string): string =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// Format "2025-06-01" → "Jun 2025" for tooltips.
export const formatMonthLong = (isoDate: string): string =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Return the last calendar day of the month given a "YYYY-MM-DD" first-of-month string.
export const lastDayOfMonth = (isoFirstOfMonth: string): string => {
  const [year, month] = isoFirstOfMonth.split("-").map(Number) as [number, number];
  // Day 0 of the next month = last day of the current month.
  const d = new Date(Date.UTC(year, month, 0)); // month is 1-based here (JS months are 0-based)
  return toIsoDate(d);
};

// Build a bills list URL pre-filtered by service code(s) and date range.
// Used for drill-down from pie segments and bar stacks (Decision #148).
export const buildBillsDrillUrl = (params: {
  services: string[];
  dateFrom: string;
  dateTo: string;
}): string => {
  const search = new URLSearchParams({
    services: params.services.join(";"),
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });
  return `${ROUTES.bills}?${search.toString()}`;
};

// Format a UAH amount for Y-axis ticks: "1 200" or "1,2k".
export const formatUahTick = (value: number): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
};

// Minimal shape of a Recharts tooltip payload item — only the fields the tooltip
// adapters read. `unknown` keeps it assignable from Recharts' loose payload type
// without a cast; values are narrowed at use.
type TTooltipPayloadItem = {
  dataKey?: unknown;
  name?: unknown;
  value?: unknown;
  color?: string;
};

// Map a Recharts tooltip payload to tooltip rows: resolve each series' label via
// `getLabel`, take its colour from the payload (CSS var resolves inside the chart),
// and format the value. Items without a numeric value (hidden/empty series) drop out.
export const toTooltipRows = (
  payload: readonly TTooltipPayloadItem[],
  getLabel: (key: string) => string,
  formatValue: (value: number) => string,
): TTooltipRow[] =>
  payload
    .filter((p): p is TTooltipPayloadItem & { value: number } => typeof p.value === "number")
    .map((p) => {
      const key = String(p.dataKey ?? p.name ?? "");
      return {
        key,
        label: getLabel(key),
        color: typeof p.color === "string" ? p.color : `var(--color-${key})`,
        value: formatValue(p.value),
      };
    });

// Sum the numeric values across a tooltip payload (for the "Total" footer).
export const sumTooltipValues = (payload: readonly TTooltipPayloadItem[]): number =>
  payload.reduce((sum, p) => sum + (typeof p.value === "number" ? p.value : 0), 0);
