import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterChip } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/filter-chip";
import { parseAsString, useQueryStates } from "nuqs";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { FilterSheet } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/filter-sheet";
import { useState } from "react";
import { usePaymentsTable } from "@/app/(app)/payments/_components/payments-client/context";
import type { TQueryFilters } from "@/app/(app)/payments/_components/payments-client/components/payments-table/types";

type TProps = {
  queryFilters: TQueryFilters;
};

export const ToolsPanel = ({ queryFilters }: TProps) => {
  const t = useTranslations("payments.list");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { properties } = usePaymentsTable();

  const [query, setQuery] = useQueryStates(
    {
      propertyId: parseAsString,
      services: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  const propertyLabel = query.propertyId
    ? (properties.find((p) => p.id === query.propertyId)?.name ?? null)
    : null;
  // const serviceLabel = query.services
  //   ? (serviceOptions.find((s) => s.id === query.services)?.name ?? null)
  //   : null;
  const serviceColor = query.services
    ? SERVICE_COLORS[query.services as keyof typeof SERVICE_COLORS]
    : undefined;

  const activeCount = [query.propertyId, query.services, query.dateFrom, query.dateTo].filter(
    Boolean,
  ).length;

  console.log("queryFilters", queryFilters);

  return (
    <div>
      <div
        className={cn("flex items-center justify-between", activeCount > 0 ? "mb-2.5" : "mb-3.5")}
      >
        <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
          {t("mobile.filters")}
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>

        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <ArrowDown size={13} />
          {t("mobile.sortDefault")}
        </span>
      </div>
      {activeCount > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {propertyLabel && (
            <FilterChip
              label={propertyLabel}
              onRemove={() => void setQuery({ propertyId: null })}
            />
          )}
          {query.services && (
            <FilterChip
              label={query.services}
              color={serviceColor}
              onRemove={() => void setQuery({ services: null })}
            />
          )}
          {query.dateFrom && (
            <FilterChip
              label={`From ${query.dateFrom}`}
              onRemove={() => void setQuery({ dateFrom: null })}
            />
          )}
          {query.dateTo && (
            <FilterChip
              label={`To ${query.dateTo}`}
              onRemove={() => void setQuery({ dateTo: null })}
            />
          )}
        </div>
      )}

      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};
