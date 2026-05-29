import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns";

import { TIME_PERIOD } from "./types";
import type { TTimePeriod } from "./types";

type TDateRange = { dateFrom: string; dateTo: string };

const fmt = (d: Date) => format(d, "yyyy-MM-dd");

export const resolvePreset = (timePeriod: TTimePeriod): TDateRange => {
  const now = new Date();

  switch (timePeriod) {
    case TIME_PERIOD.THIS_MONTH:
      return { dateFrom: fmt(startOfMonth(now)), dateTo: fmt(endOfMonth(now)) };

    case TIME_PERIOD.LAST_MONTH: {
      const prev = subMonths(now, 1);
      return { dateFrom: fmt(startOfMonth(prev)), dateTo: fmt(endOfMonth(prev)) };
    }

    case TIME_PERIOD.THIS_YEAR:
      return { dateFrom: fmt(startOfYear(now)), dateTo: fmt(endOfYear(now)) };

    case TIME_PERIOD.LAST_6_MONTHS:
      return {
        dateFrom: fmt(startOfMonth(subMonths(now, 5))),
        dateTo: fmt(endOfMonth(now)),
      };

    case TIME_PERIOD.LAST_12_MONTHS:
      return {
        dateFrom: fmt(startOfMonth(subMonths(now, 11))),
        dateTo: fmt(endOfMonth(now)),
      };
  }
};
