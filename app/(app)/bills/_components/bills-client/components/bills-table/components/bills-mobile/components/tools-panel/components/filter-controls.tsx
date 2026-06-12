import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FilterSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/filter-sheet";
import type { TQueryFilters } from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";

type TProps = {
  queryFilters: TQueryFilters;
};

export const FilterControls = ({ queryFilters }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("bills.list.filters");
  const { values } = queryFilters;

  const activeCount = [
    values.propertyId != null,
    values.services != null,
    values.dateFrom != null || values.dateTo != null,
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
      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} queryFilters={queryFilters} />
    </>
  );
};
