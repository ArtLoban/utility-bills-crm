"use client";

import { useTranslations } from "next-intl";

import { TableFilters } from "@/components/data-table/table-filters";
import { DateRangeFilter } from "@/components/date-range-filter";
import { SelectInput } from "@/components/select-input";
import type { TSelectableEntity } from "@/components/select-input/types";

import { DASHBOARD_CHART_PARAMS } from "../../../_data/query-params";
import type { TQueryFilters } from "../types";

type TProps = {
  queryFilters: TQueryFilters;
  properties: TSelectableEntity[];
  serviceOptions: TSelectableEntity[];
};

export const FilterBar = ({ queryFilters, properties, serviceOptions }: TProps) => {
  const { form, values, hasActiveFilters, handleClear } = queryFilters;
  const t = useTranslations("dashboard.charts");

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <DateRangeFilter form={form} values={values} />
      {properties.length > 1 && (
        <SelectInput
          form={form}
          field={DASHBOARD_CHART_PARAMS.PROPERTY_ID}
          label={t("property.label")}
          options={properties}
          size="sm"
        />
      )}
      <SelectInput
        form={form}
        field={DASHBOARD_CHART_PARAMS.SERVICES}
        label={t("service.label")}
        options={serviceOptions}
        size="sm"
      />
    </TableFilters>
  );
};
