import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { FilterChip } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/filter-chip";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";
import {
  FiltersFormField,
  type TQueryFilters,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import { DATE_PARAMS } from "@/lib/types/common";
import {
  dbCodeToServiceKey,
  getServiceLabel,
  SERVICE_COLORS,
} from "@/lib/constants/service-colors";

type TProps = {
  queryFilters: TQueryFilters;
};

const fmtDate = (d: string) => format(parseISO(d), DISPLAY_DATE_FORMAT);

export const ActiveFilterChips = ({ queryFilters }: TProps) => {
  const t = useTranslations("bills.list.filters");
  const { hasActiveFilters, values, form } = queryFilters;
  const { properties } = useBillsTable();

  if (!hasActiveFilters) return null;

  const propertyId = values.propertyId ?? null;
  const services = values.services ?? null;
  const dateFrom = values.dateFrom ?? null;
  const dateTo = values.dateTo ?? null;
  const hasDateFilter = dateFrom !== null || dateTo !== null;

  const dateRangeLabel =
    dateFrom && dateTo
      ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
      : dateFrom
        ? t("from", { date: fmtDate(dateFrom) })
        : dateTo
          ? t("to", { date: fmtDate(dateTo) })
          : null;

  const propertyName = propertyId
    ? (properties.find((p) => p.id === propertyId)?.name ?? propertyId)
    : null;
  const serviceName = services ? getServiceLabel(services) : null;
  const serviceKey = services ? dbCodeToServiceKey(services) : undefined;
  const serviceColor = serviceKey ? SERVICE_COLORS[serviceKey] : undefined;

  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      {propertyName && (
        <FilterChip
          label={propertyName}
          onRemove={() => form.setValue(FiltersFormField.PROPERTY_ID, null)}
        />
      )}
      {serviceName && (
        <FilterChip
          label={serviceName}
          color={serviceColor}
          onRemove={() => form.setValue(FiltersFormField.SERVICES, null)}
        />
      )}
      {hasDateFilter && dateRangeLabel && (
        <FilterChip
          label={dateRangeLabel}
          onRemove={() => {
            form.setValue(DATE_PARAMS.DATE_FROM, null);
            form.setValue(DATE_PARAMS.DATE_TO, null);
          }}
        />
      )}
    </div>
  );
};
