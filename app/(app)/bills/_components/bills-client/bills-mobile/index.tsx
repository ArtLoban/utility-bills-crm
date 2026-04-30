import { ArrowDown, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import {
  ACCENT,
  BORDER,
  DESTRUCTIVE,
  MUTED_FG,
  TINT_BG,
  TINT_BORDER,
} from "@/lib/constants/ui-tokens";
import { BILL_PROPERTIES, BILL_SERVICES, TBill, TFilterState } from "@/app/(app)/bills/_data/mock";
import { BillCard } from "./bill-card";
import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";
import { MobilePager } from "./mobile-pager";

type TProps = {
  filteredBills: TBill[];
  filters: TFilterState;
  onFilterChange: (filters: TFilterState) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  pageRows: TBill[];
  onAddBill: () => void;
};

const PERIOD_LABELS: Record<string, string> = {
  last6: "Last 6 months",
  last3: "Last 3 months",
};

const BillsMobile = ({
  filteredBills,
  filters,
  onFilterChange,
  page,
  totalPages,
  onPageChange,
  total,
  pageRows,
  onAddBill,
}: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCount = [
    filters.property !== "all",
    filters.service !== "all",
    filters.period !== "last12",
  ].filter(Boolean).length;

  const propertyName =
    filters.property !== "all"
      ? (BILL_PROPERTIES.find((p) => p.id === filters.property)?.name ?? filters.property)
      : null;

  const serviceName =
    filters.service !== "all"
      ? (BILL_SERVICES.find((s) => s.id === filters.service)?.name ?? filters.service)
      : null;

  const serviceColor =
    filters.service !== "all"
      ? SERVICE_COLORS[filters.service as keyof typeof SERVICE_COLORS]
      : undefined;

  const periodLabel = filters.period !== "last12" ? PERIOD_LABELS[filters.period] : null;

  return (
    <div style={{ padding: "20px 14px 32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>Bills</h2>
          <p style={{ fontSize: 12.5, color: MUTED_FG, marginTop: 3 }}>
            {filteredBills.length} records
          </p>
        </div>
        <Button onClick={onAddBill} style={{ height: 34, gap: 6, fontSize: 13 }}>
          <Plus size={14} />
          Add
        </Button>
      </div>

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
          style={{
            height: 32,
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            border: `1px solid ${activeCount > 0 ? TINT_BORDER : BORDER}`,
            background: activeCount > 0 ? TINT_BG : "#fff",
            color: activeCount > 0 ? ACCENT : "#09090b",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
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

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: MUTED_FG,
          }}
        >
          <ArrowDown size={13} />
          Date (newest)
        </span>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {propertyName && (
            <FilterChip
              label={propertyName}
              onRemove={() => onFilterChange({ ...filters, property: "all" })}
            />
          )}
          {serviceName && (
            <FilterChip
              label={serviceName}
              color={serviceColor}
              onRemove={() => onFilterChange({ ...filters, service: "all" })}
            />
          )}
          {periodLabel && (
            <FilterChip
              label={periodLabel}
              onRemove={() => onFilterChange({ ...filters, period: "last12" })}
            />
          )}
        </div>
      )}

      {/* Card list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pageRows.map((row) => (
          <BillCard key={row.id} row={row} />
        ))}
      </div>

      {/* Pager */}
      {totalPages > 1 && (
        <MobilePager
          page={page}
          totalPages={totalPages}
          onPrev={() => onPageChange(page - 1)}
          onNext={() => onPageChange(page + 1)}
        />
      )}

      {/* Total footer */}
      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 8,
          background: "#fff",
          border: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 13, color: MUTED_FG }}>Total (filtered)</span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: DESTRUCTIVE,
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {`−${total.toLocaleString()} UAH`}
        </span>
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export { BillsMobile };
