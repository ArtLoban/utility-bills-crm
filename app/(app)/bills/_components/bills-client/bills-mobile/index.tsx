"use client";

import { useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";

import { SERVICE_COLORS, dbCodeToServiceKey } from "@/lib/constants/service-colors";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import type { TServerPagination } from "@/lib/types/data-table";
import { BillCard } from "./bill-card";
import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";
import { MobilePager } from "./mobile-pager";

type TFilterOption = { id: string; name: string };

type TProps = {
  data: TBillGlobalRow[];
  pagination: TServerPagination;
  propertyOptions: { id: PropertyId; name: string }[];
  serviceOptions: TFilterOption[];
  onPageChange: (page: number) => void;
};

const PERIOD_LABELS: Record<string, string> = {
  last6: "Last 6 months",
  last3: "Last 3 months",
};

const BillsMobile = ({
  data,
  pagination,
  propertyOptions,
  serviceOptions,
  onPageChange,
}: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [filters, setFilters] = useQueryStates(
    {
      propertyId: parseAsString,
      service: parseAsString,
      period: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  const activeCount = [
    filters.propertyId !== null,
    filters.service !== null,
    filters.period !== null,
  ].filter(Boolean).length;

  const propertyName = filters.propertyId
    ? (propertyOptions.find((p) => p.id === filters.propertyId)?.name ?? filters.propertyId)
    : null;

  const serviceOption = filters.service
    ? serviceOptions.find((s) => s.id === filters.service)
    : null;
  const serviceName =
    serviceOption?.name ?? (filters.service ? getServiceLabel(filters.service) : null);
  const serviceKey = filters.service ? dbCodeToServiceKey(filters.service) : undefined;
  const serviceColor = serviceKey ? SERVICE_COLORS[serviceKey] : undefined;

  const periodLabel = filters.period ? (PERIOD_LABELS[filters.period] ?? null) : null;

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
            ...(activeCount > 0
              ? {
                  border: `1px solid ${TINT_BORDER}`,
                  background: TINT_BG,
                  color: ACCENT,
                }
              : {}),
          }}
        >
          Filters
          {activeCount > 0 && (
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
      {activeCount > 0 && (
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
              onRemove={() => void setFilters({ service: null })}
            />
          )}
          {periodLabel && (
            <FilterChip label={periodLabel} onRemove={() => void setFilters({ period: null })} />
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
          onPrev={() => onPageChange(pagination.page - 1)}
          onNext={() => onPageChange(pagination.page + 1)}
        />
      )}

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onFilterChange={(updated) => void setFilters(updated)}
        propertyOptions={propertyOptions}
        serviceOptions={serviceOptions}
      />
    </div>
  );
};

export { BillsMobile };
