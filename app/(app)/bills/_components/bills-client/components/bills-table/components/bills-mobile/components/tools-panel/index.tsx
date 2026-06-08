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
  const { sorting, onSortingChange } = listParams;

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
  const activeFilterCount = [
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

  const { hasActiveFilters } = queryFilters;

  return (
    <div>
      <div
        className={`flex items-center justify-between ${hasActiveFilters ? "mb-2.5" : "mb-3.5"}`}
      >
        {/* Filter button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-[13px] font-medium"
          style={{
            border: `1px solid ${hasActiveFilters ? "var(--field-tint-border)" : "var(--border)"}`,
            background: hasActiveFilters ? "var(--field-tint-bg)" : "var(--background)",
            color: hasActiveFilters ? "var(--field-tint-fg)" : "var(--foreground)",
          }}
        >
          Filters
          {hasActiveFilters && (
            <span
              className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white"
              style={{ background: "var(--field-tint-fg)" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort trigger */}
        <button
          onClick={() => setSortSheetOpen(true)}
          className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2.5 text-xs font-medium whitespace-nowrap"
          style={{
            border: `1px solid ${isNonDefaultSort ? "var(--field-tint-border)" : "transparent"}`,
            background: isNonDefaultSort ? "var(--field-tint-bg)" : "transparent",
            color: isNonDefaultSort ? "var(--field-tint-fg)" : "var(--muted-foreground)",
          }}
        >
          {currentDesc ? (
            <ChevronDown size={11} strokeWidth={2} />
          ) : (
            <ChevronUp size={11} strokeWidth={2} />
          )}
          {sortTriggerLabel}
        </button>
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
