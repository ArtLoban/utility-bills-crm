import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterChip } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/filter-chip";
import { FilterSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/filter-sheet";
import { SortSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/sort-sheet";
import {
  DEFAULT_SORT_DESC,
  DEFAULT_SORT_ID,
  SORT_FIELDS,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/constants";
import type { TBillSortColumn } from "@/features/bills";
import {
  dbCodeToServiceKey,
  getServiceLabel,
  SERVICE_COLORS,
} from "@/lib/constants/service-colors";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";
import { useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { format, parseISO } from "date-fns";
import { TQueryFilters } from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import type { TListParams } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type TProps = {
  queryFilters: TQueryFilters;
  listParams: TListParams;
};

const fmtDateChip = (d: string) => format(parseISO(d), "MMM d, yyyy");

const formatDateRangeChip = (dateFrom: string | null, dateTo: string | null): string => {
  if (dateFrom && dateTo) return `${fmtDateChip(dateFrom)} – ${fmtDateChip(dateTo)}`;
  if (dateFrom) return `From ${fmtDateChip(dateFrom)}`;
  return `To ${fmtDateChip(dateTo!)}`;
};

export const ToolsPanel = ({ queryFilters, listParams }: TProps) => {
  const { hasActiveFilters } = queryFilters;
  const { sorting, onSortingChange } = listParams;
  const t = useTranslations("payments.list"); // TODO: path
  const { properties } = useBillsTable();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const [filters, setFilters] = useQueryStates(
    {
      propertyId: parseAsString,
      services: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  // Sort state
  const currentSort = sorting[0];
  const currentSortId = currentSort?.id ?? DEFAULT_SORT_ID;
  const currentDesc = currentSort?.desc ?? DEFAULT_SORT_DESC;
  const isNonDefaultSort = currentSortId !== DEFAULT_SORT_ID || currentDesc !== DEFAULT_SORT_DESC;

  const activeSortField = SORT_FIELDS.find((f) => f.id === currentSortId);
  const sortTriggerLabel = activeSortField
    ? currentDesc
      ? activeSortField.triggerDesc
      : activeSortField.triggerAsc
    : "Date (newest)";

  const handleSort = (id: TBillSortColumn, desc: boolean) => {
    onSortingChange([{ id, desc }]);
  };

  // Filter state
  const hasDateFilter = filters.dateFrom !== null || filters.dateTo !== null;
  const activeCount = [
    filters.propertyId !== null,
    filters.services !== null,
    hasDateFilter,
  ].filter(Boolean).length;

  const propertyName = filters.propertyId
    ? (properties.find((p) => p.id === filters.propertyId)?.name ?? filters.propertyId)
    : null;
  const serviceName = filters.services ? getServiceLabel(filters.services) : null;
  const serviceKey = filters.services ? dbCodeToServiceKey(filters.services) : undefined;
  const serviceColor = serviceKey ? SERVICE_COLORS[serviceKey] : undefined;

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
          {t("mobile.filters")}
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        <Button
          variant={isNonDefaultSort ? "active" : "outline"}
          onClick={() => setSortSheetOpen(true)}
          className="font-normal"
        >
          {currentDesc ? (
            <ChevronDown size={11} strokeWidth={2} />
          ) : (
            <ChevronUp size={11} strokeWidth={2} />
          )}
          {sortTriggerLabel}
        </Button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {propertyName && (
            <FilterChip
              label={propertyName}
              onRemove={() => void setFilters({ propertyId: null })}
            />
          )}
          {serviceName && (
            <FilterChip
              label={serviceName}
              color={serviceColor}
              onRemove={() => void setFilters({ services: null })}
            />
          )}
          {hasDateFilter && (
            <FilterChip
              label={formatDateRangeChip(filters.dateFrom, filters.dateTo)}
              onRemove={() => void setFilters({ dateFrom: null, dateTo: null })}
            />
          )}
        </div>
      )}

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onFilterChange={(updated) => void setFilters(updated)}
        propertyOptions={properties}
      />

      <SortSheet
        open={sortSheetOpen}
        onOpenChange={setSortSheetOpen}
        currentSortId={currentSortId}
        currentDesc={currentDesc}
        onSort={handleSort}
      />
    </div>
  );
};
