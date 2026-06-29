"use client";

import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import { FilterChip } from "@/components/filter-chip";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { DATE_PARAMS } from "@/lib/types/common";

import type { TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
};

const fmtDate = (date: string) => format(parseISO(date), DISPLAY_DATE_FORMAT);

export const ActiveFilterChips = ({ queryFilters }: TProps) => {
  const { hasActiveFilters, values, form } = queryFilters;
  const t = useTranslations("meters.detail.readings.filters");

  if (!hasActiveFilters) return null;

  const dateFrom = values[DATE_PARAMS.DATE_FROM];
  const dateTo = values[DATE_PARAMS.DATE_TO];

  const dateRangeLabel =
    dateFrom && dateTo
      ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
      : dateFrom
        ? t("from", { date: fmtDate(dateFrom) })
        : dateTo
          ? t("to", { date: fmtDate(dateTo) })
          : null;

  if (!dateRangeLabel) return null;

  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      <FilterChip
        icon={Calendar}
        label={dateRangeLabel}
        onRemove={() => {
          form.setValue(DATE_PARAMS.DATE_FROM, null);
          form.setValue(DATE_PARAMS.DATE_TO, null);
        }}
      />
    </div>
  );
};
