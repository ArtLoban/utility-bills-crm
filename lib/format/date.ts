import { format } from "date-fns";

export const formatDateShort = (sortTs: number): string => {
  const s = sortTs.toString();
  const date = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  return format(date, "MMM d, yyyy");
};
