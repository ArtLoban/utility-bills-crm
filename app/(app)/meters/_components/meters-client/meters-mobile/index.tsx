import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import type { TFilterState } from "../../../_data/mock";
import { formatServiceCode } from "../utils";
import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";
import { MeterCard } from "./meter-card";
import { MobilePager } from "./mobile-pager";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TPropertyOption = { id: string; name: string };
type TServiceTypeOption = { code: string };

type TProps = {
  filteredMeters: TMeterGlobalRow[];
  filters: TFilterState;
  onFilterChange: (key: keyof TFilterState, value: string) => void;
  onClear: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageRows: TMeterGlobalRow[];
  properties: TPropertyOption[];
  serviceTypes: TServiceTypeOption[];
};

const MetersMobile = ({
  filteredMeters,
  filters,
  onFilterChange,
  onClear,
  page,
  totalPages,
  onPageChange,
  pageRows,
  properties,
  serviceTypes,
}: TProps) => {
  const t = useTranslations("meters.list");
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilterCount = [
    filters.property !== "all",
    filters.service !== "all",
    filters.status !== "active",
  ].filter(Boolean).length;

  const propertyName =
    filters.property !== "all"
      ? (properties.find((p) => p.id === filters.property)?.name ?? filters.property)
      : null;

  const serviceColor =
    filters.service !== "all"
      ? getServiceTypeVisuals(filters.service as TServiceTypeCode).color
      : undefined;

  const showHistoricalBadge = filters.status === "all";

  return (
    <div style={{ padding: "20px 14px 32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>
            {t("title")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5, marginTop: 3 }}>
            {filteredMeters.length} meters
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: activeFilterCount > 0 ? 10 : 14,
        }}
      >
        <button
          onClick={() => setSheetOpen(true)}
          className={
            activeFilterCount === 0
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
            ...(activeFilterCount > 0
              ? { border: `1px solid ${TINT_BORDER}`, background: TINT_BG, color: ACCENT }
              : {}),
          }}
        >
          Filters
          {activeFilterCount > 0 && (
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
              {activeFilterCount}
            </span>
          )}
        </button>

        <span
          className="text-zinc-500 dark:text-zinc-400"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
        >
          <ArrowDown size={13} />
          Property / Service
        </span>
      </div>

      {activeFilterCount > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {propertyName && (
            <FilterChip label={propertyName} onRemove={() => onFilterChange("property", "all")} />
          )}
          {filters.service !== "all" && (
            <FilterChip
              label={formatServiceCode(filters.service)}
              color={serviceColor}
              onRemove={() => onFilterChange("service", "all")}
            />
          )}
          {filters.status !== "active" && (
            <FilterChip
              label={
                filters.status === "historical"
                  ? t("filters.statusHistorical")
                  : t("filters.statusAll")
              }
              onRemove={() => onFilterChange("status", "active")}
            />
          )}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pageRows.map((row) => (
          <MeterCard key={row.meter.id} row={row} showHistoricalBadge={showHistoricalBadge} />
        ))}
      </div>

      {totalPages > 1 && (
        <MobilePager
          page={page}
          totalPages={totalPages}
          onPrev={() => onPageChange(page - 1)}
          onNext={() => onPageChange(page + 1)}
        />
      )}

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onFilterChange={onFilterChange}
        onClear={onClear}
        properties={properties}
        serviceTypes={serviceTypes}
      />
    </div>
  );
};

export { MetersMobile };
