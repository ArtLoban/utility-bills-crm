"use client";

import * as React from "react";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DAYS_IN_MONTH = 31;
const DAY_NUMBERS: readonly number[] = Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1);

const CLAMP_FROM = 29;

type TProps = {
  value: number | null;
  onChange: (day: number) => void;
  disabled?: boolean;
  placeholder?: string;
  heading?: string;
  clampNote?: string;
};

export const DayOfMonthPicker = React.forwardRef<HTMLButtonElement, TProps>(
  ({ value, onChange, disabled, placeholder, heading, clampNote, ...triggerProps }, ref) => {
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
        <PopoverContent className="w-[278px] p-3">
          {heading ? (
            <div className="text-muted-foreground mb-2 pl-0.5 text-xs font-semibold tracking-wide uppercase">
              {heading}
            </div>
          ) : null}

          <div className="grid grid-cols-7 gap-1">
            {DAY_NUMBERS.map((day) => {
              const isSelected = value === day;
              const clamps = day >= CLAMP_FROM;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted",
                  )}
                >
                  {day}
                  {clamps ? (
                    <span
                      className={cn(
                        "absolute bottom-1 left-1/2 size-[3px] -translate-x-1/2 rounded-full",
                        isSelected ? "bg-primary-foreground/80" : "bg-primary",
                      )}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {clampNote ? (
            <div className="text-muted-foreground mt-2.5 flex items-center gap-1.5 border-t pt-2.5 text-xs">
              <span className="bg-primary size-1 shrink-0 rounded-full" />
              {clampNote}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    );
  },
);

DayOfMonthPicker.displayName = "DayOfMonthPicker";
