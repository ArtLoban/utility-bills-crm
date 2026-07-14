"use client";

import { format, parseISO } from "date-fns";
import { Calendar, CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { FilterChip } from "@/components/filter-chip";
import { DISPLAY_DATE_FORMAT, formatMonthYearLong } from "@/lib/format/date";
import { DATE_PARAMS } from "@/lib/types/common";
import { useServiceTypeMetaFactory } from "@/features/services/hooks/use-service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";

import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
};

const fmtDate = (date: string) => format(parseISO(date), DISPLAY_DATE_FORMAT);

export const ActiveFilterChips = ({ queryFilters }: TProps) => {
  const { hasActiveFilters, values, form } = queryFilters;
  const t = useTranslations("bills.list.filters");
  const locale = useLocale();
  const { properties } = useBillsTable();
  const getServiceTypeMeta = useServiceTypeMetaFactory();

  if (!hasActiveFilters) return null;

  const propertyId = values[FiltersFormField.PROPERTY_ID];
  const services = values[FiltersFormField.SERVICES];
  const periodFrom = values[FiltersFormField.PERIOD_FROM];
  const dateFrom = values[DATE_PARAMS.DATE_FROM];
  const dateTo = values[DATE_PARAMS.DATE_TO];

  const property = propertyId ? properties.find(({ id }) => id === propertyId) : undefined;
  const propertyIcon = property ? PROPERTY_TYPE_ICONS[property.type] : PROPERTY_TYPE_ICONS.other;

  const service = services ? getServiceTypeMeta(services as TServiceTypeCode) : undefined;

  const periodLabel = periodFrom ? formatMonthYearLong(periodFrom, locale) : null;

  const dateRangeLabel =
    dateFrom && dateTo
      ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
      : dateFrom
        ? t("from", { date: fmtDate(dateFrom) })
        : dateTo
          ? t("to", { date: fmtDate(dateTo) })
          : null;

  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      {property && (
        <FilterChip
          icon={propertyIcon}
          label={property.name}
          color="var(--brand)"
          onRemove={() => form.setValue(FiltersFormField.PROPERTY_ID, null)}
        />
      )}
      {service && (
        <FilterChip
          icon={service.Icon}
          label={service.label}
          color={service.color}
          onRemove={() => form.setValue(FiltersFormField.SERVICES, null)}
        />
      )}
      {dateRangeLabel && (
        <FilterChip
          icon={Calendar}
          label={dateRangeLabel}
          onRemove={() => {
            form.setValue(DATE_PARAMS.DATE_FROM, null);
            form.setValue(DATE_PARAMS.DATE_TO, null);
          }}
        />
      )}
      {periodLabel && (
        <FilterChip
          icon={CalendarDays}
          label={periodLabel}
          onRemove={() => {
            form.setValue(FiltersFormField.PERIOD_FROM, null);
            form.setValue(FiltersFormField.PERIOD_TO, null);
          }}
        />
      )}
    </div>
  );
};
