import { format } from "date-fns";

// Shared date-fns format tokens — one source so machine value and display stay consistent.
export const ISO_DATE_FORMAT = "yyyy-MM-dd"; // machine value: URLs, DB, form state
export const DISPLAY_DATE_FORMAT = "dd/MM/yyyy"; // human display, e.g. "10/06/2026"

export const formatDateShort = (sortTs: number): string => {
  const s = sortTs.toString();
  const date = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  return format(date, "MMM d, yyyy");
};
