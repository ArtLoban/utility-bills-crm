"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PRESETS } from "../constants";
import type { TTimePeriod } from "../types";
import { resolvePreset } from "../utils";
import { DateInput } from "@/components/date-range-filter/components/date-input";
import { DATE_PARAMS } from "@/lib/types/common";

const CLEAR_VALUE = "__clear__";

type TProps = {
  [DATE_PARAMS.DATE_FROM]: string | null;
  [DATE_PARAMS.DATE_TO]: string | null;
  onChange: (dateFrom: string | null, dateTo: string | null) => void;
};

// TODO: properly refactor component
export const DateRangeInput = ({ dateFrom, dateTo, onChange }: TProps) => {
  const [timePeriod, setTimePeriod] = useState<TTimePeriod | null>(null);
  const [prevDateFrom, setPrevDateFrom] = useState<string | null>(dateFrom);
  const [prevDateTo, setPrevDateTo] = useState<string | null>(dateTo);

  if (prevDateFrom !== dateFrom || prevDateTo !== dateTo) {
    setPrevDateFrom(dateFrom);
    setPrevDateTo(dateTo);
    if (dateFrom === null && dateTo === null) {
      setTimePeriod(null);
    }
  }

  const handlePresetChange = (value: string) => {
    if (value === CLEAR_VALUE) {
      setTimePeriod(null);
      onChange(null, null);
      return;
    }

    const id = value as TTimePeriod;
    const resolved = resolvePreset(id);
    setTimePeriod(id);
    onChange(resolved.dateFrom, resolved.dateTo);
  };

  const handleDateFromChange = (value: string | null) => {
    setTimePeriod(null);
    onChange(value, dateTo);
  };

  const handleDateToChange = (value: string | null) => {
    setTimePeriod(null);
    onChange(dateFrom, value);
  };

  return (
    <div className="flex items-center gap-2">
      <DateInput label="Date from" value={dateFrom} onChange={handleDateFromChange} />
      <DateInput label="Date to" value={dateTo} onChange={handleDateToChange} />

      <Select value={timePeriod ?? ""} onValueChange={handlePresetChange}>
        <SelectTrigger
          className={cn(
            "min-w-[140px] rounded-sm",
            timePeriod && "border-brand text-brand bg-brand-bg [&_svg]:text-inherit",
          )}
        >
          <SelectValue placeholder="Time Period" />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value={CLEAR_VALUE} className="text-muted-foreground">
            Time Period
          </SelectItem>
          {PRESETS.map(({ id, label }) => (
            <SelectItem key={id} value={id}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
