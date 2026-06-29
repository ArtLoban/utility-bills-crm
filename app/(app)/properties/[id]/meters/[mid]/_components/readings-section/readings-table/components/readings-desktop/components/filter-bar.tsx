"use client";

import { DateRangeFilter } from "@/components/date-range-filter";
import { TableFilters } from "@/components/data-table/table-filters";

import type { TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterBar = ({ queryFilters }: TProps) => {
  const { form, values, hasActiveFilters, handleClear } = queryFilters;

  return (
    <TableFilters hasActiveFilters={hasActiveFilters} onClear={handleClear}>
      <DateRangeFilter form={form} values={values} />
    </TableFilters>
  );
};
