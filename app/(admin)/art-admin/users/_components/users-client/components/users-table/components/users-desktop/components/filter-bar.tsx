"use client";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";

import { ROLE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "../../../constants";
import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  form: TQueryFilters["form"];
  hasActiveFilters: boolean;
  onClear: () => void;
};

export const FilterBar = ({ form, hasActiveFilters, onClear }: TProps) => (
  <TableFilters hasActiveFilters={hasActiveFilters} onClear={onClear}>
    <SelectInput
      form={form}
      field={FiltersFormField.ROLE}
      label="Role"
      options={ROLE_FILTER_OPTIONS}
      size="sm"
    />
    <SelectInput
      form={form}
      field={FiltersFormField.STATUS}
      label="Status"
      options={STATUS_FILTER_OPTIONS}
      size="sm"
    />
  </TableFilters>
);
