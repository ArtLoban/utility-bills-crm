import { ChevronDown } from "lucide-react";

import { BILL_PROPERTIES, BILL_SERVICES, TFilterState } from "@/app/(app)/bills/_data/mock";

type TProps = {
  filters: TFilterState;
  onFilterChange: (filters: TFilterState) => void;
  anyFilter: boolean;
};

const ACCENT = "#7c3aed";
const MUTED_FG = "#71717a";
const TINT_BG = "#f5f3ff";
const TINT_BORDER = "#ede9fe";

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
      style={{
        appearance: "none",
        height: 32,
        paddingLeft: 12,
        paddingRight: 28,
        fontSize: 13,
        borderRadius: 6,
        minWidth: 140,
        border: `1px solid ${isActive ? TINT_BORDER : "#e4e4e7"}`,
        background: isActive ? TINT_BG : "#fff",
        color: isActive ? ACCENT : "#09090b",
        fontWeight: isActive ? 500 : 400,
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
      }}
    >
      {children}
    </select>
    <ChevronDown
      size={13}
      strokeWidth={2}
      style={{
        position: "absolute",
        right: 8,
        pointerEvents: "none",
        color: isActive ? ACCENT : MUTED_FG,
      }}
    />
  </div>
);

const FilterBar = ({ filters, onFilterChange, anyFilter }: TProps) => {
  const set = (key: keyof TFilterState) => (value: string) =>
    onFilterChange({ ...filters, [key]: value });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        padding: "10px 14px",
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <span style={{ fontSize: 12.5, color: MUTED_FG, paddingLeft: 2 }}>Filter</span>

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
          style={{
            fontSize: 12.5,
            color: MUTED_FG,
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
