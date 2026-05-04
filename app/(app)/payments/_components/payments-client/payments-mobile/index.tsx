import { ArrowDown, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import {
  PAYMENT_PROPERTIES,
  PAYMENT_SERVICES,
  TFilterState,
  TPayment,
} from "@/app/(app)/payments/_data/mock";
import { PaymentCard } from "./payment-card";
import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";
import { MobilePager } from "./mobile-pager";

const SUCCESS_COLOR = "#16a34a";

type TProps = {
  filteredPayments: TPayment[];
  filters: TFilterState;
  onFilterChange: (filters: TFilterState) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  pageRows: TPayment[];
  onAddPayment: () => void;
  onEditPayment: (payment: TPayment) => void;
};

const PERIOD_LABELS: Record<string, string> = {
  last6: "Last 6 months",
  last3: "Last 3 months",
};

const PaymentsMobile = ({
  filteredPayments,
  filters,
  onFilterChange,
  page,
  totalPages,
  onPageChange,
  total,
  pageRows,
  onAddPayment,
  onEditPayment,
}: TProps) => {
  const t = useTranslations("payments.list");
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCount = [
    filters.property !== "all",
    filters.service !== "all",
    filters.period !== "last12",
  ].filter(Boolean).length;

  const propertyName =
    filters.property !== "all"
      ? (PAYMENT_PROPERTIES.find((p) => p.id === filters.property)?.name ?? filters.property)
      : null;

  const serviceName =
    filters.service !== "all"
      ? (PAYMENT_SERVICES.find((s) => s.id === filters.service)?.name ?? filters.service)
      : null;

  const serviceColor =
    filters.service !== "all"
      ? SERVICE_COLORS[filters.service as keyof typeof SERVICE_COLORS]
      : undefined;

  const periodLabel = filters.period !== "last12" ? (PERIOD_LABELS[filters.period] ?? null) : null;

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
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>
            {t("title")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5, marginTop: 3 }}>
            {filteredPayments.length}
          </p>
        </div>
        <Button onClick={onAddPayment} style={{ height: 34, gap: 6, fontSize: 13 }}>
          <Plus size={14} />
          {t("mobile.add")}
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
          {t("mobile.filters")}
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
          className="text-zinc-500 dark:text-zinc-400"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
        >
          <ArrowDown size={13} />
          {t("mobile.sortDefault")}
        </span>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
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
          <PaymentCard key={row.id} row={row} onEdit={onEditPayment} />
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
        className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13 }}>
          {t("footer.totalPaid")}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: SUCCESS_COLOR,
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {`${total.toLocaleString()} UAH`}
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

export { PaymentsMobile };
