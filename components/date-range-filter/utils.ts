import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns";

import { DATE_PARAMS } from "@/lib/types/common";
import { ISO_DATE_FORMAT } from "@/lib/format/date";
import { TIME_PERIODS, type TTimePeriod } from "./types";

type TDateRange = {
  [DATE_PARAMS.DATE_FROM]: string;
  [DATE_PARAMS.DATE_TO]: string;
};

const fmt = (date: Date) => format(date, ISO_DATE_FORMAT);

export const resolvePreset = (timePeriod: TTimePeriod): TDateRange => {
  const now = new Date();

  switch (timePeriod) {
    case TIME_PERIODS.THIS_MONTH:
      return {
        [DATE_PARAMS.DATE_FROM]: fmt(startOfMonth(now)),
        [DATE_PARAMS.DATE_TO]: fmt(endOfMonth(now)),
      };

    case TIME_PERIODS.LAST_MONTH: {
      const prev = subMonths(now, 1);
      return {
        [DATE_PARAMS.DATE_FROM]: fmt(startOfMonth(prev)),
        [DATE_PARAMS.DATE_TO]: fmt(endOfMonth(prev)),
      };
    }

    case TIME_PERIODS.THIS_YEAR:
      return {
        [DATE_PARAMS.DATE_FROM]: fmt(startOfYear(now)),
        [DATE_PARAMS.DATE_TO]: fmt(endOfYear(now)),
      };

    case TIME_PERIODS.LAST_6_MONTHS:
      return {
        [DATE_PARAMS.DATE_FROM]: fmt(startOfMonth(subMonths(now, 5))),
        [DATE_PARAMS.DATE_TO]: fmt(endOfMonth(now)),
      };

    case TIME_PERIODS.LAST_12_MONTHS:
      return {
        [DATE_PARAMS.DATE_FROM]: fmt(startOfMonth(subMonths(now, 11))),
        [DATE_PARAMS.DATE_TO]: fmt(endOfMonth(now)),
      };
  }
};

export const isTimePeriod = (value: string): value is TTimePeriod =>
  Object.values(TIME_PERIODS).some((id) => id === value);

// The preset whose resolved range exactly matches the current dates, or null when the
// dates are partial/custom. Keeps the preset highlight a pure function of the dates —
// no local state — so it survives reloads and manual date edits.
export const derivePreset = (
  dateFrom: string | null,
  dateTo: string | null,
): TTimePeriod | null => {
  if (!dateFrom || !dateTo) return null;

  for (const id of Object.values(TIME_PERIODS)) {
    const resolved = resolvePreset(id);
    if (resolved[DATE_PARAMS.DATE_FROM] === dateFrom && resolved[DATE_PARAMS.DATE_TO] === dateTo) {
      return id;
    }
  }

  return null;
};
