import { ChevronDown } from "lucide-react";

import { RECORD_STATUS } from "@/lib/types/record-status";
import { PROPERTY_OWNERS, TFilterState } from "@/app/(admin)/art-admin/properties/_data/mock";
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
        value={filters.owner}
        isActive={filters.owner !== "all"}
        onChange={set("owner")}
      >
        <option value="all">Owner: All</option>
        {PROPERTY_OWNERS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={filters.status}
        isActive={filters.status !== "all"}
        onChange={set("status")}
      >
        <option value="all">Status: All</option>
        <option value={RECORD_STATUS.ACTIVE}>Active</option>
        <option value={RECORD_STATUS.DELETED}>Deleted</option>
      </FilterSelect>

      <FilterSelect value={filters.type} isActive={filters.type !== "all"} onChange={set("type")}>
        <option value="all">Type: All</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="cottage">Cottage</option>
      </FilterSelect>

      {anyFilter && (
        <button
          onClick={() => onFilterChange({ owner: "all", status: "all", type: "all" })}
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
