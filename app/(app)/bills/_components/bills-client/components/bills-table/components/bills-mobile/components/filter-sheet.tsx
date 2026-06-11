import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { PRESETS } from "@/components/date-range-filter/constants";
import type { TTimePeriod } from "@/components/date-range-filter/types";
import { resolvePreset } from "@/components/date-range-filter/utils";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { SheetDialog } from "@/components/sheet-dialog";
import { FiltersFormField, type TQueryFilters } from "../../../types";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";
import { Form } from "@/components/ui/form";
import { FormSelectField } from "@/components/form/form-select-field";

type TFilterOption = { id: string; name: string };

type TFilters = {
  propertyId: string | null;
  services: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

type TSheetSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

const SheetSelect = ({ label, value, onChange, children }: TSheetSelectProps) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-sm border border-zinc-200 bg-white pr-8 pl-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
        style={{ height: 38 }}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={2}
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
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
    <label className="mb-1.5 block text-xs font-medium">{label}</label>
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full rounded-sm border border-zinc-200 bg-white px-3 text-sm text-zinc-950 [color-scheme:light] outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:[color-scheme:dark]"
      style={{ height: 38 }}
    />
  </div>
);

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryFilters: TQueryFilters;
  filters: TFilters;
  onFilterChange: (filters: TFilters) => void;
  propertyOptions: TFilterOption[];
};

export const FilterSheet = ({
  open,
  onOpenChange,
  queryFilters,
  filters,
  onFilterChange,
}: TProps) => {
  const [timePeriod, setTimePeriod] = useState<TTimePeriod | null>(null);
  const serviceOptions = useServiceOptions();

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

  const { form, handleClear } = queryFilters;
  const { properties } = useBillsTable();

  const handleClose = () => {
    setTimePeriod(null);
    handleClear();
    onOpenChange(false);
  };

  return (
    <SheetDialog
      title="Filters"
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      closeLabel="Clear filters"
    >
      <Form {...form}>
        <div className="flex flex-col gap-3">
          <FormSelectField
            control={form.control}
            name={FiltersFormField.PROPERTY_ID}
            label="Property"
            placeholder="All properties"
            options={properties}
            clearable
          />
          <FormSelectField
            control={form.control}
            name={FiltersFormField.SERVICES}
            label="Service"
            placeholder="All services"
            options={serviceOptions}
            clearable
          />
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
      </Form>
    </SheetDialog>
  );
};
