"use client";

import { CircleDot, User } from "lucide-react";

import { FilterChip } from "@/components/filter-chip";
import { ADMIN_PROPERTY_STATUS_FILTERS } from "@/features/admin-properties/types";
import { PROPERTY_TYPE_ICONS, PROPERTY_TYPE_LABELS } from "@/features/properties/property-type";
import type { TPropertyType } from "@/lib/db/schema/properties";

import { FiltersFormField, type TOwnerFilter, type TQueryFilters } from "../../../types";

type TProps = {
  queryFilters: TQueryFilters;
  ownerFilter: TOwnerFilter;
  hasActiveFilters: boolean;
};

export const ActiveFilterChips = ({ queryFilters, ownerFilter, hasActiveFilters }: TProps) => {
  const { values, form } = queryFilters;

  if (!hasActiveFilters) return null;

  const type = values[FiltersFormField.TYPE];
  const status = values[FiltersFormField.STATUS];
  const showStatus = status != null && status !== ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE;
  const statusLabel = status === ADMIN_PROPERTY_STATUS_FILTERS.DELETED ? "Deleted" : "All";

  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      {type && (
        <FilterChip
          icon={PROPERTY_TYPE_ICONS[type as TPropertyType]}
          label={PROPERTY_TYPE_LABELS[type as TPropertyType]}
          color="var(--brand)"
          onRemove={() => form.setValue(FiltersFormField.TYPE, null)}
        />
      )}
      {showStatus && (
        <FilterChip
          icon={CircleDot}
          label={statusLabel}
          onRemove={() =>
            form.setValue(FiltersFormField.STATUS, ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE)
          }
        />
      )}
      {ownerFilter.name && (
        <FilterChip
          icon={User}
          label={ownerFilter.name}
          color="var(--brand)"
          onRemove={ownerFilter.clear}
        />
      )}
    </div>
  );
};
