"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useServiceOptions } from "@/features/services/hooks/use-service-options";
import { usePaymentsTable } from "@/app/(app)/payments/_components/payments-client/context";

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
  const { properties } = usePaymentsTable();
  const serviceOptions = useServiceOptions();

  const [query, setQuery] = useQueryStates(
    {
      propertyId: parseAsString,
      services: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  const handleClear = () => {
    void setQuery({ propertyId: null, services: null, dateFrom: null, dateTo: null });
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
              value={query.propertyId}
              onChange={(v) => void setQuery({ propertyId: v })}
              options={properties}
              placeholder={t("filters.allProperties")}
            />
            <FilterSelect
              label={t("filters.service")}
              value={query.services}
              onChange={(v) => void setQuery({ services: v })}
              options={serviceOptions}
              placeholder={t("filters.allServices")}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">From</label>
              <Input
                type="date"
                value={query.dateFrom ?? ""}
                onChange={(e) => void setQuery({ dateFrom: e.target.value || null })}
                className="h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">To</label>
              <Input
                type="date"
                value={query.dateTo ?? ""}
                onChange={(e) => void setQuery({ dateTo: e.target.value || null })}
                className="h-9"
              />
            </div>
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
