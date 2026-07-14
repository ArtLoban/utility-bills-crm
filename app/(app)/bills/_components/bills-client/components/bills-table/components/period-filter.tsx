"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { MonthPicker } from "@/components/month-picker";
import { Label } from "@/components/ui/label";

import { FiltersFormField, type TFiltersFormValues } from "../types";

type TProps = {
  form: UseFormReturn<TFiltersFormValues>;
  value: string | null | undefined; // periodFrom (YYYY-MM)
  orientation?: "inline" | "stacked";
};

export const PeriodFilter = ({ form, value, orientation = "inline" }: TProps) => {
  const t = useTranslations("bills.list.filters");
  const isStacked = orientation === "stacked";

  const handleChange = (month: string) => {
    form.setValue(FiltersFormField.PERIOD_FROM, month, { shouldDirty: true });
    form.setValue(FiltersFormField.PERIOD_TO, month, { shouldDirty: true });
  };

  const picker = (
    <MonthPicker
      value={value ?? null}
      onChange={handleChange}
      variant={isStacked ? "field" : "filter"}
      fullWidth={isStacked}
      placeholder={isStacked ? t("selectMonth") : t("period")}
    />
  );

  if (!isStacked) return picker;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-normal">{t("period")}</Label>
      {picker}
    </div>
  );
};
