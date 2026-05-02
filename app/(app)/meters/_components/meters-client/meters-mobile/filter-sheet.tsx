import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SERVICE_LABELS } from "@/lib/constants/service-colors";
import { ACCENT } from "@/lib/constants/ui-tokens";
import type { TFilterState } from "../../../_data/mock";
import { METER_PROPERTIES } from "../../../_data/mock";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TFilterState;
  onFilterChange: (key: keyof TFilterState, value: string) => void;
  onClear: () => void;
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

const FilterSheet = ({ open, onOpenChange, filters, onFilterChange, onClear }: TProps) => {
  const t = useTranslations("meters.list");

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div
            className="bg-zinc-200 dark:bg-zinc-700"
            style={{ width: 36, height: 4, borderRadius: 2 }}
          />
        </div>

        <div style={{ padding: "0 16px 24px" }}>
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

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SheetSelect
              label={t("filters.property")}
              value={filters.property}
              onChange={(v) => onFilterChange("property", v)}
            >
              <option value="all">All properties</option>
              {METER_PROPERTIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </SheetSelect>

            <SheetSelect
              label={t("filters.serviceType")}
              value={filters.service}
              onChange={(v) => onFilterChange("service", v)}
            >
              <option value="all">All service types</option>
              {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </SheetSelect>

            <SheetSelect
              label={t("filters.status")}
              value={filters.status}
              onChange={(v) => onFilterChange("status", v)}
            >
              <option value="active">{t("filters.statusActive")}</option>
              <option value="historical">{t("filters.statusHistorical")}</option>
              <option value="all">{t("filters.statusAll")}</option>
            </SheetSelect>
          </div>

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
              {t("filters.clear")}
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
