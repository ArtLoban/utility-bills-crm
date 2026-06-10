"use client";

import { DateRangeFilter } from "@/components/date-range-filter";
import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";

import { FiltersFormField, TQueryFilters } from "../../../types";
import { useBillsTable } from "../../../../../context";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterBar = ({ queryFilters }: TProps) => {
  const { form, values, hasActiveFilters, handleClear } = queryFilters;
  const { properties } = useBillsTable();
  const serviceOptions = useServiceOptions();

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <DateRangeFilter form={form} values={values} />
      <SelectInput
        form={form}
        field={FiltersFormField.PROPERTY_ID}
        label="Property"
        options={properties}
        size="sm"
      />
      <SelectInput
        form={form}
        field={FiltersFormField.SERVICES}
        label="Service"
        options={serviceOptions}
        size="sm"
      />
    </TableFilters>
  );
};
