import { ChevronDown, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ACCENT, BORDER, MUTED_FG } from "@/lib/constants/ui-tokens";
import { BILL_PROPERTIES, BILL_SERVICES, TFilterState } from "@/app/(app)/bills/_data/mock";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TFilterState;
  onFilterChange: (filters: TFilterState) => void;
};

type TSheetSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

const SheetSelect = ({ label, value, onChange, children }: TSheetSelectProps) => (
  <div>
    <label style={{ fontSize: 12.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          width: "100%",
          height: 38,
          paddingLeft: 12,
          paddingRight: 32,
          fontSize: 14,
          borderRadius: 6,
          border: `1px solid ${BORDER}`,
          background: "#fff",
          color: "#09090b",
          cursor: "pointer",
          outline: "none",
          fontFamily: "inherit",
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={2}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: MUTED_FG,
        }}
      />
    </div>
  </div>
);

const FilterSheet = ({ open, onOpenChange, filters, onFilterChange }: TProps) => {
  const set = (key: keyof TFilterState) => (value: string) =>
    onFilterChange({ ...filters, [key]: value });

  const handleClear = () => {
    onFilterChange({ property: "all", service: "all", period: "last12" });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} />
        </div>

        {/* Inner content */}
        <div style={{ padding: "0 16px 24px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0 16px",
            }}
          >
            <SheetTitle style={{ fontSize: 15, fontWeight: 600 }}>Filters</SheetTitle>
            <SheetClose
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <X size={16} color={MUTED_FG} />
            </SheetClose>
          </div>

          {/* Selects */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SheetSelect label="Property" value={filters.property} onChange={set("property")}>
              <option value="all">All properties</option>
              {BILL_PROPERTIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </SheetSelect>

            <SheetSelect label="Service" value={filters.service} onChange={set("service")}>
              <option value="all">All services</option>
              {BILL_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SheetSelect>

            <SheetSelect label="Period" value={filters.period} onChange={set("period")}>
              <option value="last12">Last 12 months</option>
              <option value="last6">Last 6 months</option>
              <option value="last3">Last 3 months</option>
            </SheetSelect>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleClear}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 8,
                border: "none",
                background: "#f4f4f5",
                fontSize: 14,
                fontFamily: "inherit",
                fontWeight: 500,
                cursor: "pointer",
                color: "#09090b",
              }}
            >
              Clear
            </button>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                flex: 2,
                height: 40,
                borderRadius: 8,
                border: "none",
                background: ACCENT,
                fontSize: 14,
                fontFamily: "inherit",
                fontWeight: 500,
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { FilterSheet };
