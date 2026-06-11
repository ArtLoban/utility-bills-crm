"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SELECT_CLEAR_VALUE } from "@/lib/constants/select";
import { DATE_PARAMS } from "@/lib/types/common";
import { DatePicker } from "@/components/date-picker";
import { PRESETS } from "../constants";
import type { TDateRangeOrientation } from "../types";
import { derivePreset, isTimePeriod, resolvePreset } from "../utils";

type TProps = {
  [DATE_PARAMS.DATE_FROM]: string | null;
  [DATE_PARAMS.DATE_TO]: string | null;
  onChange: (dateFrom: string | null, dateTo: string | null) => void;
  orientation?: TDateRangeOrientation;
};

export const DateRangeInput = ({ dateFrom, dateTo, onChange, orientation = "inline" }: TProps) => {
  const t = useTranslations("common.dateRange");
  const isStacked = orientation === "stacked";
  const activePreset = derivePreset(dateFrom, dateTo);

  const handlePresetChange = (value: string) => {
    if (!isTimePeriod(value)) {
      onChange(null, null);
      return;
    }
    const resolved = resolvePreset(value);
    onChange(resolved[DATE_PARAMS.DATE_FROM], resolved[DATE_PARAMS.DATE_TO]);
  };

  return (
    <div className={cn("flex gap-2", isStacked ? "flex-col gap-3" : "items-center")}>
      <DatePicker
        label={t("dateFrom")}
        value={dateFrom}
        fullWidth={isStacked}
        onChange={(value) => onChange(value, dateTo)}
      />
      <DatePicker
        label={t("dateTo")}
        value={dateTo}
        fullWidth={isStacked}
        onChange={(value) => onChange(dateFrom, value)}
      />

      <Select value={activePreset ?? ""} onValueChange={handlePresetChange}>
        <SelectTrigger
          className={cn(
            "rounded-sm",
            isStacked ? "w-full" : "min-w-[140px]",
            activePreset && "border-brand text-brand bg-brand-bg [&_svg]:text-inherit",
          )}
        >
          <SelectValue placeholder={t("timePeriod")} />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value={SELECT_CLEAR_VALUE} className="text-muted-foreground">
            {t("timePeriod")}
          </SelectItem>
          {PRESETS.map(({ id }) => (
            <SelectItem key={id} value={id}>
              {t(`presets.${id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
