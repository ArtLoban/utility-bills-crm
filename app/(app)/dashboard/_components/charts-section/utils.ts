import { ROUTES } from "@/lib/routes";

import type { TTooltipRow } from "./components/chart-tooltip-card";
import type { TSeriesDrill } from "./series";

// Build a bills list URL pre-filtered by a series' drill target and period range.
// Used for drill-down from pie segments and bar stacks (Decision #148). A regular type
// filters by its type code; a custom `other` series filters by its specific service id.
// periodFrom/periodTo are YYYY-MM — the bills list filters them against periodMonth.
export const buildBillsDrillUrl = (params: {
  drill: TSeriesDrill;
  periodFrom: string;
  periodTo: string;
}): string => {
  const { drill, periodFrom, periodTo } = params;
  const search = new URLSearchParams({ periodFrom, periodTo });
  if (drill.kind === "type") search.set("services", drill.code);
  else search.set("serviceId", drill.serviceId);
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
