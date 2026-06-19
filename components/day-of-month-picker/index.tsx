"use client";

import * as React from "react";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// A day of month recurs every month and is not tied to a weekday, so the grid is a plain
// 1–31 number grid — no weekday headers, no month/year navigation. 31 covers the longest
// month; the firing logic clamps oversized days to the actual month length.
const DAYS_IN_MONTH = 31;
const DAY_NUMBERS: readonly number[] = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

type TProps = {
  value: number | null;
  onChange: (day: number) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const DayOfMonthPicker = React.forwardRef<HTMLButtonElement, TProps>(
  ({ value, onChange, disabled, placeholder, ...triggerProps }, ref) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (day: number) => {
      onChange(day);
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
            <span className={cn(!value && "text-muted-foreground")}>{value ?? placeholder}</span>
            <CalendarDays className="text-muted-foreground pointer-events-none size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid grid-cols-7 gap-1.5">
            {DAY_NUMBERS.map((day) => {
              const isSelected = value === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "rounded-md py-1.5 text-sm tabular-nums transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

DayOfMonthPicker.displayName = "DayOfMonthPicker";
