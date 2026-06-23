"use client";

import { CircleDot, Shield } from "lucide-react";

import { FilterChip } from "@/components/filter-chip";
import { ADMIN_USER_STATUS_FILTERS } from "@/features/admin-users/types";

import { ROLE_FILTER_OPTIONS } from "../../../constants";
import { FiltersFormField, type TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
  hasActiveFilters: boolean;
};

export const ActiveFilterChips = ({ queryFilters, hasActiveFilters }: TProps) => {
  const { values, form } = queryFilters;

  if (!hasActiveFilters) return null;

  const role = values[FiltersFormField.ROLE];
  const status = values[FiltersFormField.STATUS];
  const showStatus = status != null && status !== ADMIN_USER_STATUS_FILTERS.ACTIVE;
  const statusLabel = status === ADMIN_USER_STATUS_FILTERS.DELETED ? "Deleted" : "All";
  const roleLabel = ROLE_FILTER_OPTIONS.find((option) => option.id === role)?.name;

  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      {role && roleLabel && (
        <FilterChip
          icon={Shield}
          label={roleLabel}
          color="var(--brand)"
          onRemove={() => form.setValue(FiltersFormField.ROLE, null)}
        />
      )}
      {showStatus && (
        <FilterChip
          icon={CircleDot}
          label={statusLabel}
          onRemove={() => form.setValue(FiltersFormField.STATUS, ADMIN_USER_STATUS_FILTERS.ACTIVE)}
        />
      )}
    </div>
  );
};
