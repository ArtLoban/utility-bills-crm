"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ADMIN_PROPERTY_STATUS_FILTERS } from "@/features/admin-properties/types";

import { FiltersFormField, type TOwnerFilter, type TQueryFilters } from "../../../types";
import { FilterSheet } from "./filter-sheet";

type TProps = {
  queryFilters: TQueryFilters;
  ownerFilter: TOwnerFilter;
  onClear: () => void;
};

export const FilterControls = ({ queryFilters, ownerFilter, onClear }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { values } = queryFilters;

  const activeCount = [
    values[FiltersFormField.STATUS] != null &&
      values[FiltersFormField.STATUS] !== ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE,
    values[FiltersFormField.TYPE] != null,
    ownerFilter.name !== null,
  ].filter(Boolean).length;

  return (
    <>
      <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
        Filters
        {activeCount > 0 && (
          <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>
      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        queryFilters={queryFilters}
        onClear={onClear}
      />
    </>
  );
};
