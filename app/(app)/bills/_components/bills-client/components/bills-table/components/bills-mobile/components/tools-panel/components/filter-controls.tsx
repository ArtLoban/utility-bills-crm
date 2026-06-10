import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FilterSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/filter-sheet";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";
import {
  FiltersFormField,
  type TQueryFilters,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import { DATE_PARAMS } from "@/lib/types/common";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterControls = ({ queryFilters }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("payments.list"); // TODO: fix namespace to bills
  const { properties } = useBillsTable();
  const { values, form } = queryFilters;

  const activeCount = [
    values.propertyId != null,
    values.services != null,
    values.dateFrom != null || values.dateTo != null,
  ].filter(Boolean).length;

  const filters = {
    propertyId: values.propertyId ?? null,
    services: values.services ?? null,
    dateFrom: values.dateFrom ?? null,
    dateTo: values.dateTo ?? null,
  };

  const handleFilterChange = (updated: typeof filters) => {
    form.setValue(FiltersFormField.PROPERTY_ID, updated.propertyId);
    form.setValue(FiltersFormField.SERVICES, updated.services);
    form.setValue(DATE_PARAMS.DATE_FROM, updated.dateFrom ?? null);
    form.setValue(DATE_PARAMS.DATE_TO, updated.dateTo ?? null);
  };

  return (
    <>
      <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
        {t("mobile.filters")}
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
        filters={filters}
        onFilterChange={handleFilterChange}
        propertyOptions={properties}
      />
    </>
  );
};
