import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";
import {
  FiltersFormField,
  type TQueryFilters,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import { DATE_PARAMS } from "@/lib/types/common";
import { useServiceTypeMetaFactory } from "@/features/services/hooks/use-service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import { FilterChip } from "./components/filter-chip";

type TProps = {
  queryFilters: TQueryFilters;
};

const fmtDate = (date: string) => format(parseISO(date), DISPLAY_DATE_FORMAT);

export const ActiveFilterChips = ({ queryFilters }: TProps) => {
  const { hasActiveFilters, values, form } = queryFilters;
  const t = useTranslations("bills.list.filters");
  const { properties } = useBillsTable();
  const getServiceTypeMeta = useServiceTypeMetaFactory();

  if (!hasActiveFilters) return null;

  const propertyId = values[FiltersFormField.PROPERTY_ID];
  const services = values[FiltersFormField.SERVICES];
  const dateFrom = values[DATE_PARAMS.DATE_FROM];
  const dateTo = values[DATE_PARAMS.DATE_TO];

  const property = propertyId ? properties.find(({ id }) => id === propertyId) : undefined;
  const propertyIcon = property ? PROPERTY_TYPE_ICONS[property.type] : PROPERTY_TYPE_ICONS.other;

  const service = services ? getServiceTypeMeta(services as TServiceTypeCode) : undefined;

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
    </div>
  );
};
