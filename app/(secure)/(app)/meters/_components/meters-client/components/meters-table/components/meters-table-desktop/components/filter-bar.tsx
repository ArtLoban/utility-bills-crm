"use client";

import { useTranslations } from "next-intl";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { FiltersFormField, TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const FilterBar = ({ queryFilters, properties }: TProps) => {
  const { form, hasActiveFilters, handleClear } = queryFilters;
  const t = useTranslations("meters.list");
  const serviceOptions = useServiceOptions();

  const statusOptions = [
    { id: METER_STATUSES.ACTIVE, name: t("filters.statusActive") },
    { id: METER_STATUSES.HISTORICAL, name: t("filters.statusHistorical") },
    { id: METER_STATUSES.ALL, name: t("filters.statusAll") },
  ];

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <SelectInput
        form={form}
        field={FiltersFormField.PROPERTY_ID}
        label={t("filters.property")}
        options={properties}
        size="sm"
      />
      <SelectInput
        form={form}
        field={FiltersFormField.SERVICES}
        label={t("filters.serviceType")}
        options={serviceOptions}
        size="sm"
      />
      <SelectInput
        form={form}
        field={FiltersFormField.STATUS}
        label={t("filters.status")}
        options={statusOptions}
        size="sm"
      />
    </TableFilters>
  );
};
