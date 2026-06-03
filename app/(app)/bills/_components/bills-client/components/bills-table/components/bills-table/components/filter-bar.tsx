"use client";

import { DateRangeFilter } from "@/components/date-range-filter";
import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";

import type { TQueryFilters } from "../../../types";
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
      <SelectInput form={form} field="propertyId" label="Property" options={properties} />
      <SelectInput form={form} field="service" label="Service" options={serviceOptions} />
    </TableFilters>
  );
};
