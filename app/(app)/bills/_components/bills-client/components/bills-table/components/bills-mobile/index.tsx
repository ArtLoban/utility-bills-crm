"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { parseAsString, useQueryStates } from "nuqs";

import { SERVICE_COLORS, dbCodeToServiceKey } from "@/lib/constants/service-colors";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { formatUAH } from "@/lib/format/currency";
import { TBillsListResult } from "@/lib/db/access/bills";
import { BillCard } from "./components/bill-card";
import { FilterChip } from "./components/filter-chip";
import { FilterSheet } from "./components/filter-sheet";
import { MobilePager } from "./components/mobile-pager";
import { TListParams } from "@/components/data-table/types";
import { useBillsTable } from "../../../../context";
import { TQueryFilters } from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";

type TProps = {
  billsList: TBillsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

const fmtDate = (d: string) => format(parseISO(d), "MMM d, yyyy");

const formatDateRangeChip = (dateFrom: string | null, dateTo: string | null): string => {
  if (dateFrom && dateTo) return `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`;
  if (dateFrom) return `From ${fmtDate(dateFrom)}`;
  return `To ${fmtDate(dateTo!)}`;
};

export const BillsTableMobile = (props: TProps) => {
  const { billsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = billsList;
  const { setPage } = listParams;
  const { properties } = useBillsTable();
  const [sheetOpen, setSheetOpen] = useState(false);

  const [filters, setFilters] = useQueryStates(
    {
      propertyId: parseAsString,
      services: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  const hasDateFilter = filters.dateFrom !== null || filters.dateTo !== null;

  const activeCount = [
    filters.propertyId !== null,
    filters.services !== null,
    hasDateFilter,
  ].filter(Boolean).length;

  const propertyName = filters.propertyId
    ? (properties.find((p) => p.id === filters.propertyId)?.name ?? filters.propertyId)
    : null;

  // const serviceName =
  //   serviceOption?.name ?? (filters.services ? getServiceLabel(filters.services) : null);
  const serviceName = "serviceName";
  const serviceKey = filters.services ? dbCodeToServiceKey(filters.services) : undefined;
  const serviceColor = serviceKey ? SERVICE_COLORS[serviceKey] : undefined;

  const { hasActiveFilters } = queryFilters;

  return (
    <div style={{ padding: "12px 14px 32px" }}>
      {/* Filter trigger row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: activeCount > 0 ? 10 : 14,
        }}
      >
        <button
          onClick={() => setSheetOpen(true)}
          className={
            activeCount === 0
              ? "border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              : ""
          }
          style={{
            height: 32,
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
            ...(hasActiveFilters
              ? {
                  border: `1px solid ${TINT_BORDER}`,
                  background: TINT_BG,
                  color: ACCENT,
                }
              : {}),
          }}
        >
          Filters
          {hasActiveFilters && (
            <span
              style={{
                minWidth: 16,
                height: 16,
                borderRadius: 999,
                background: ACCENT,
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 700,
                padding: "0 4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeCount}
            </span>
          )}
        </button>

        <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
          {pagination.total} {pagination.total === 1 ? "bill" : "bills"}
        </span>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
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

      {/* Card list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((row) => (
          <BillCard key={row.bill.id} row={row} />
        ))}
      </div>

      {/* Pager */}
      {pagination.totalPages > 1 && (
        <MobilePager
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={() => setPage(pagination.page - 1)}
          onNext={() => setPage(pagination.page + 1)}
        />
      )}

      <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-muted-foreground text-sm">Total</span>
        <span className="text-[15px] font-bold tabular-nums">
          {formatUAH(Number(totals.amount))}
        </span>
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onFilterChange={(updated) => void setFilters(updated)}
        propertyOptions={properties}
      />
    </div>
  );
};
