"use client";

import * as React from "react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  currentYearMonth,
  formatMonthLabel,
  getMonthShortLabels,
  parseYearMonth,
  toYearMonth,
} from "./utils";

type TProps = {
  value: string | null;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
};

export const MonthPicker = React.forwardRef<HTMLButtonElement, TProps>(
  ({ value, onChange, min, max, disabled, placeholder, ...triggerProps }, ref) => {
    const locale = useLocale();
    const [open, setOpen] = useState(false);

    const initialYear = (value ? parseYearMonth(value) : parseYearMonth(currentYearMonth())).year;
    const [viewYear, setViewYear] = useState(initialYear);

    const monthLabels = getMonthShortLabels(locale);
    const selectedMonth =
      value && parseYearMonth(value).year === viewYear ? parseYearMonth(value).month : null;

    const isBeyondMax = (ym: string) => max !== undefined && ym > max;
    const isBeforeMin = (ym: string) => min !== undefined && ym < min;

    const canGoPrev = min === undefined || viewYear > parseYearMonth(min).year;
    const canGoNext = max === undefined || viewYear < parseYearMonth(max).year;

    const handleSelect = (month: number) => {
      onChange(toYearMonth(viewYear, month));
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            data-filled={value ? true : undefined}
            className={cn(
              "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 flex h-9.5 w-full cursor-pointer items-center justify-between gap-1.5 rounded-sm border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[filled=true]:border-[var(--field-tint-border)] data-[filled=true]:bg-[var(--field-tint-bg)]",
            )}
            {...triggerProps}
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? formatMonthLabel(value, locale) : placeholder}
            </span>
            <CalendarDays className="text-muted-foreground pointer-events-none size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setViewYear((year) => year - 1)}
              className="hover:bg-accent flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous year"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-medium">{viewYear}</span>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setViewYear((year) => year + 1)}
              className="hover:bg-accent flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next year"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {monthLabels.map((label, index) => {
              const month = index + 1;
              const ym = toYearMonth(viewYear, month);
              const isDisabled = isBeyondMax(ym) || isBeforeMin(ym);
              const isSelected = selectedMonth === month;

              return (
                <button
                  key={month}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(month)}
                  className={cn(
                    "rounded-md py-1.5 text-sm capitalize transition-colors disabled:pointer-events-none disabled:opacity-40",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

MonthPicker.displayName = "MonthPicker";
