import { ROUTES } from "@/lib/routes";

// Format "2025-06-01" → "Jun" for X-axis tick labels.
export const formatMonthLabel = (isoDate: string): string =>
  new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
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
  return d.toISOString().slice(0, 10);
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
