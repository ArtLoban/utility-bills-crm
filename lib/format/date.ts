import { format, formatDistanceToNow } from "date-fns";

// Shared date-fns format tokens — one source so machine value and display stay consistent.
export const ISO_DATE_FORMAT = "yyyy-MM-dd"; // machine value: URLs, DB, form state
export const ISO_MONTH_FORMAT = "yyyy-MM"; // machine value: YYYY-MM year-month (period filter, MonthPicker)
export const DISPLAY_DATE_FORMAT = "dd/MM/yyyy"; // human display, e.g. "10/06/2026"
export const DISPLAY_DATE_PLACEHOLDER = "dd/mm/yyyy"; // empty-state hint matching DISPLAY_DATE_FORMAT

// Today's local date as a machine-value ISO string — the canonical default for date fields.
export const todayIso = (): string => format(new Date(), ISO_DATE_FORMAT);

export const toIsoDate = (date: Date): string =>
  date.toISOString().slice(0, ISO_DATE_FORMAT.length);

// "2025-06-01" → "2025-06". Truncates an ISO date to its year-month.
export const isoToYearMonth = (isoDate: string): string =>
  isoDate.slice(0, ISO_MONTH_FORMAT.length);

export const toDatetimeOffset = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";

  const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offset) % 60).padStart(2, "0");

  return `${dateStr}T00:00:00${sign}${hh}:${mm}`;
};

export const formatDisplayDate = (date: Date | null | undefined): string =>
  date ? format(new Date(date), DISPLAY_DATE_FORMAT) : "—";

export const formatRelativeTime = (date: Date): string =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const formatDateShort = (sortTs: number): string => {
  const s = sortTs.toString();
  const date = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));

  return format(date, "MMM d, yyyy");
};
