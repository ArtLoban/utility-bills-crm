"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { endOfYear, format, parse } from "date-fns";
import { enUS, ru, uk } from "date-fns/locale";
import type { Locale, Matcher } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { DISPLAY_DATE_FORMAT, ISO_DATE_FORMAT } from "@/lib/format/date";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const DROPDOWN_START_YEAR = 2000;

// next-intl locale → date-fns locale for weekday/month labels and formatted display.
const DATE_FNS_LOCALES: Record<string, Locale> = { en: enUS, ru, uk };

const parseIso = (value: string): Date => parse(value, ISO_DATE_FORMAT, new Date());

type TProps = {
  value: string | null; // ISO "yyyy-MM-dd"
  onChange: (value: string | null) => void;
  min?: string; // ISO date — earliest selectable day
  max?: string; // ISO date — latest selectable day
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  // Optional inline prefix rendered inside the trigger (e.g. "From"/"To" in a filter row).
  // Data-entry usage leaves this unset — the label comes from the surrounding field shell.
  label?: string;
};

export const DatePicker = ({
  value,
  onChange,
  min,
  max,
  disabled,
  placeholder,
  fullWidth = false,
  label,
}: TProps) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const dateFnsLocale = DATE_FNS_LOCALES[locale] ?? enUS;

  const selected = value ? parseIso(value) : undefined;
  const minDate = min ? parseIso(min) : undefined;
  const maxDate = max ? parseIso(max) : undefined;

  const outOfRange: Matcher[] = [];
  if (minDate) outOfRange.push({ before: minDate });
  if (maxDate) outOfRange.push({ after: maxDate });

  // Bounds the month/year dropdowns. min/max win; otherwise 2000 → end of the current year.
  const navStart = minDate ?? new Date(DROPDOWN_START_YEAR, 0, 1);
  const navEnd = maxDate ?? endOfYear(new Date());

  const handleSelect = (date: Date | undefined) => {
    onChange(date ? format(date, ISO_DATE_FORMAT) : null);
    setOpen(false);
  };

  return (
    // modal: see month-picker — keeps the popover interactive when nested in a Dialog.
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-filled={value ? true : undefined}
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 flex h-9.5 items-center justify-between gap-1.5 rounded-sm border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[filled=true]:border-[var(--field-tint-border)] data-[filled=true]:bg-[var(--field-tint-bg)]",
            fullWidth ? "w-full" : "w-auto",
            !disabled && "cursor-pointer",
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {label && (
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            )}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {selected ? format(selected, DISPLAY_DATE_FORMAT) : placeholder}
            </span>
          </span>
          <CalendarIcon className="text-muted-foreground pointer-events-none size-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected ?? maxDate}
          disabled={outOfRange}
          startMonth={navStart}
          endMonth={navEnd}
          locale={dateFnsLocale}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};
