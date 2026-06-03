import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PRESETS } from "@/components/date-range-filter/constants";
import type { TTimePeriod } from "@/components/date-range-filter/types";
import { resolvePreset } from "@/components/date-range-filter/utils";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";

type TFilterOption = { id: string; name: string };

type TFilters = {
  propertyId: string | null;
  services: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TFilters;
  onFilterChange: (filters: TFilters) => void;
  propertyOptions: TFilterOption[];
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
        className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        style={{
          appearance: "none",
          width: "100%",
          height: 38,
          paddingLeft: 12,
          paddingRight: 32,
          fontSize: 14,
          borderRadius: 6,
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
        className="text-zinc-500 dark:text-zinc-400"
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  </div>
);

type TSheetDateInputProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

const SheetDateInput = ({ label, value, onChange }: TSheetDateInputProps) => (
  <div>
    <label style={{ fontSize: 12.5, fontWeight: 500, display: "block", marginBottom: 6 }}>
      {label}
    </label>
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="border border-zinc-200 bg-white text-zinc-950 [color-scheme:light] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:[color-scheme:dark]"
      style={{
        width: "100%",
        height: 38,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 14,
        borderRadius: 6,
        outline: "none",
        fontFamily: "inherit",
      }}
    />
  </div>
);

const FilterSheet = ({ open, onOpenChange, filters, onFilterChange, propertyOptions }: TProps) => {
  const [timePeriod, setTimePeriod] = useState<TTimePeriod | null>(null);
  const serviceOptions = useServiceOptions();

  const setField =
    (key: keyof Pick<TFilters, "propertyId" | "services">) =>
    (value: string): void => {
      onFilterChange({ ...filters, [key]: value === "" ? null : value });
    };

  const handleDateFromChange = (value: string | null) => {
    setTimePeriod(null);
    onFilterChange({ ...filters, dateFrom: value });
  };

  const handleDateToChange = (value: string | null) => {
    setTimePeriod(null);
    onFilterChange({ ...filters, dateTo: value });
  };

  const handlePresetChange = (value: string) => {
    if (value === "") {
      setTimePeriod(null);
      onFilterChange({ ...filters, dateFrom: null, dateTo: null });
      return;
    }
    const id = value as TTimePeriod;
    const resolved = resolvePreset(id);
    setTimePeriod(id);
    onFilterChange({ ...filters, dateFrom: resolved.dateFrom, dateTo: resolved.dateTo });
  };

  const handleClear = () => {
    setTimePeriod(null);
    onFilterChange({ propertyId: null, services: null, dateFrom: null, dateTo: null });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div
            className="bg-zinc-200 dark:bg-zinc-700"
            style={{ width: 36, height: 4, borderRadius: 2 }}
          />
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
              <X size={16} className="text-zinc-500 dark:text-zinc-400" />
            </SheetClose>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SheetSelect
              label="Property"
              value={filters.propertyId ?? ""}
              onChange={setField("propertyId")}
            >
              <option value="">All properties</option>
              {propertyOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </SheetSelect>

            <SheetSelect
              label="Service"
              value={filters.services ?? ""}
              onChange={setField("services")}
            >
              <option value="">All services</option>
              {serviceOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SheetSelect>

            <SheetDateInput
              label="Date from"
              value={filters.dateFrom}
              onChange={handleDateFromChange}
            />

            <SheetDateInput label="Date to" value={filters.dateTo} onChange={handleDateToChange} />

            <SheetSelect label="Time Period" value={timePeriod ?? ""} onChange={handlePresetChange}>
              <option value="">Select period</option>
              {PRESETS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </SheetSelect>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleClear}
              className="bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
              style={{
                flex: 1,
                height: 40,
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontFamily: "inherit",
                fontWeight: 500,
                cursor: "pointer",
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
