"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PAYMENT_PROPERTIES, PAYMENT_SERVICES } from "@/app/(app)/payments/_data/mock";
import { INITIAL_FILTERS, URL_FIELDS } from "../payments-table/constants";

const PERIOD_OPTIONS = [
  { id: "last3", name: "Last 3 months" },
  { id: "last6", name: "Last 6 months" },
  { id: "last12", name: "Last 12 months" },
];

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TFilterSelectProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { id: string; name: string }[];
  placeholder: string;
};

const FilterSelect = ({ label, value, onChange, options, placeholder }: TFilterSelectProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium">{label}</label>
    <Select value={value || ""} onValueChange={(v) => onChange(v === "__clear__" ? null : v)}>
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__clear__">{placeholder}</SelectItem>
        {options.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export const FilterSheet = ({ open, onOpenChange }: TProps) => {
  const t = useTranslations("payments.list");
  const [query, setQuery] = useQueryStates(URL_FIELDS);

  const handleClear = () => {
    void setQuery(INITIAL_FILTERS);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="px-4 pb-6">
          <div className="flex items-center justify-between py-3">
            <SheetTitle>{t("mobile.filters")}</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <X size={16} className="text-muted-foreground" />
              </Button>
            </SheetClose>
          </div>

          <div className="flex flex-col gap-3.5">
            <FilterSelect
              label={t("filters.property")}
              value={query.property}
              onChange={(v) => void setQuery({ property: v })}
              options={PAYMENT_PROPERTIES}
              placeholder={t("filters.allProperties")}
            />
            <FilterSelect
              label={t("filters.service")}
              value={query.service}
              onChange={(v) => void setQuery({ service: v })}
              options={PAYMENT_SERVICES}
              placeholder={t("filters.allServices")}
            />
            <FilterSelect
              label={t("filters.period")}
              value={query.paidAt}
              onChange={(v) => void setQuery({ paidAt: v })}
              options={PERIOD_OPTIONS}
              placeholder={t("filters.periodLast12")}
            />
          </div>

          <div className="mt-5 flex gap-2.5">
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              {t("filters.clear")}
            </Button>
            <Button className="flex-[2]" onClick={() => onOpenChange(false)}>
              {t("mobile.apply")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
