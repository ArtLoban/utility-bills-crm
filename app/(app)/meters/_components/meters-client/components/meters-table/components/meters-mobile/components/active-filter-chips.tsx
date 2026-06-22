"use client";

import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";

import { FilterChip } from "@/components/filter-chip";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import { useServiceTypeMetaFactory } from "@/features/services/hooks/use-service-type";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const ActiveFilterChips = ({ queryFilters, properties }: TProps) => {
  const { hasActiveFilters, values, form } = queryFilters;
  const t = useTranslations("meters.list.filters");
  const getServiceTypeMeta = useServiceTypeMetaFactory();

  if (!hasActiveFilters) return null;

  const propertyId = values[FiltersFormField.PROPERTY_ID];
  const services = values[FiltersFormField.SERVICES];
  const status = values[FiltersFormField.STATUS];

  const property = propertyId ? properties.find(({ id }) => id === propertyId) : undefined;
  const propertyIcon = property ? PROPERTY_TYPE_ICONS[property.type] : PROPERTY_TYPE_ICONS.other;
  const service = services ? getServiceTypeMeta(services as TServiceTypeCode) : undefined;
  const statusLabel =
    status && status !== METER_STATUSES.ACTIVE
      ? status === METER_STATUSES.HISTORICAL
        ? t("statusHistorical")
        : t("statusAll")
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
      {statusLabel && (
        <FilterChip
          icon={Gauge}
          label={statusLabel}
          onRemove={() => form.setValue(FiltersFormField.STATUS, METER_STATUSES.ACTIVE)}
        />
      )}
    </div>
  );
};
