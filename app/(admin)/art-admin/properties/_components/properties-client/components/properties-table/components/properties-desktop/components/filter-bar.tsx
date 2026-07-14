"use client";

import { User } from "lucide-react";

import { TableFilters } from "@/components/data-table/table-filters";
import { SelectInput } from "@/components/select-input";
import { FilterChip } from "@/components/filter-chip";

import { PROPERTY_TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from "../../../constants";
import { FiltersFormField, type TOwnerFilter, type TQueryFilters } from "../../../types";

type TProps = {
  form: TQueryFilters["form"];
  ownerFilter: TOwnerFilter;
  hasActiveFilters: boolean;
  onClear: () => void;
};

export const FilterBar = ({ form, ownerFilter, hasActiveFilters, onClear }: TProps) => (
  <TableFilters hasActiveFilters={hasActiveFilters} onClear={onClear}>
    <SelectInput
      form={form}
      field={FiltersFormField.STATUS}
      label="Status"
      options={STATUS_FILTER_OPTIONS}
      size="sm"
    />
    <SelectInput
      form={form}
      field={FiltersFormField.TYPE}
      label="Type"
      options={PROPERTY_TYPE_FILTER_OPTIONS}
      size="sm"
    />
    {ownerFilter.name && (
      <FilterChip
        icon={User}
        label={ownerFilter.name}
        color="var(--brand)"
        onRemove={ownerFilter.clear}
      />
    )}
  </TableFilters>
);
