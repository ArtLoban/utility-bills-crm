"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { FiltersFormField, type TQueryFilters } from "../../../types";
import { FilterSheet } from "./filter-sheet";

type TProps = {
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const FilterControls = ({ queryFilters, properties }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("meters.list.filters");
  const { values } = queryFilters;

  const activeCount = [
    values[FiltersFormField.PROPERTY_ID] != null,
    values[FiltersFormField.SERVICES] != null,
    values[FiltersFormField.STATUS] != null &&
      values[FiltersFormField.STATUS] !== METER_STATUSES.ACTIVE,
  ].filter(Boolean).length;

  return (
    <>
      <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
        {t("label")}
        {activeCount > 0 && (
          <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>
      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        queryFilters={queryFilters}
        properties={properties}
      />
    </>
  );
};
