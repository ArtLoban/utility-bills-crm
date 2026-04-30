import { ChevronDown } from "lucide-react";

import { BILL_PROPERTIES, BILL_SERVICES, TFilterState } from "@/app/(app)/bills/_data/mock";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";

type TProps = {
  filters: TFilterState;
  onFilterChange: (filters: TFilterState) => void;
  anyFilter: boolean;
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

const FilterBar = ({ filters, onFilterChange, anyFilter }: TProps) => {
  const set = (key: keyof TFilterState) => (value: string) =>
    onFilterChange({ ...filters, [key]: value });

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
        onChange={set("property")}
      >
        <option value="all">All properties</option>
        {BILL_PROPERTIES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={filters.service}
        isActive={filters.service !== "all"}
        onChange={set("service")}
      >
        <option value="all">All services</option>
        {BILL_SERVICES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={filters.period}
        isActive={filters.period !== "last12"}
        onChange={set("period")}
      >
        <option value="last12">Last 12 months</option>
        <option value="last6">Last 6 months</option>
        <option value="last3">Last 3 months</option>
      </FilterSelect>

      {anyFilter && (
        <button
          onClick={() => onFilterChange({ property: "all", service: "all", period: "last12" })}
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
          Clear filters
        </button>
      )}
    </div>
  );
};

export { FilterBar };
