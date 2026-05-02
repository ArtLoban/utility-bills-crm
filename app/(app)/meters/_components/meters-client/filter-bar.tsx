import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { SERVICE_LABELS } from "@/lib/constants/service-colors";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import type { TFilterState } from "../../_data/mock";
import { METER_PROPERTIES } from "../../_data/mock";

type TProps = {
  filters: TFilterState;
  onFilterChange: (key: keyof TFilterState, value: string) => void;
  anyFilter: boolean;
  onClear: () => void;
};

type TSelectProps = {
  value: string;
  isActive: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

const FilterSelect = ({ value, isActive, onChange, children }: TSelectProps) => (
  <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        !isActive
          ? "border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          : ""
      }
      style={{
        appearance: "none",
        height: 32,
        paddingLeft: 12,
        paddingRight: 28,
        fontSize: 13,
        borderRadius: 6,
        minWidth: 140,
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
        ...(isActive
          ? {
              border: `1px solid ${TINT_BORDER}`,
              background: TINT_BG,
              color: ACCENT,
              fontWeight: 500,
            }
          : { fontWeight: 400 }),
      }}
    >
      {children}
    </select>
    <ChevronDown
      size={13}
      strokeWidth={2}
      className={!isActive ? "text-zinc-500 dark:text-zinc-400" : ""}
      style={{
        position: "absolute",
        right: 8,
        pointerEvents: "none",
        ...(isActive ? { color: ACCENT } : {}),
      }}
    />
  </div>
);

const FilterBar = ({ filters, onFilterChange, anyFilter, onClear }: TProps) => {
  const t = useTranslations("meters.list");

  return (
    <div
      className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        padding: "10px 14px",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5, paddingLeft: 2 }}>
        Filter
      </span>

      <FilterSelect
        value={filters.property}
        isActive={filters.property !== "all"}
        onChange={(v) => onFilterChange("property", v)}
      >
        <option value="all">All properties</option>
        {METER_PROPERTIES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={filters.service}
        isActive={filters.service !== "all"}
        onChange={(v) => onFilterChange("service", v)}
      >
        <option value="all">All service types</option>
        {Object.entries(SERVICE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={filters.status}
        isActive={filters.status !== "active"}
        onChange={(v) => onFilterChange("status", v)}
      >
        <option value="active">{t("filters.statusActive")}</option>
        <option value="historical">{t("filters.statusHistorical")}</option>
        <option value="all">{t("filters.statusAll")}</option>
      </FilterSelect>

      {anyFilter && (
        <button
          onClick={onClear}
          className="text-zinc-500 dark:text-zinc-400"
          style={{
            fontSize: 12.5,
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          {t("filters.clear")}
        </button>
      )}
    </div>
  );
};

export { FilterBar };
