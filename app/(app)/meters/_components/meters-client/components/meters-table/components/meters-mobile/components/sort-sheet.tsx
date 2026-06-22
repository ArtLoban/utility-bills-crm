"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { TMeterSortColumn } from "@/features/meters/types";
import { SheetDialog } from "@/components/sheet-dialog";
import { Button } from "@/components/ui/button";

import { SORT_FIELDS, type TSortField } from "../constants";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSortId: TMeterSortColumn;
  currentDesc: boolean;
  onSort: (id: TMeterSortColumn, desc: boolean) => void;
};

export const SortSheet = ({ open, onOpenChange, currentSortId, currentDesc, onSort }: TProps) => {
  const t = useTranslations("meters.list.sort");

  const handleSelect = (field: TSortField) => {
    const isSame = currentSortId === field.id;
    const nextDesc = isSame ? !currentDesc : field.defaultDesc;
    onSort(field.id, nextDesc);
    onOpenChange(false);
  };

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  return (
    <SheetDialog title={t("title")} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        {SORT_FIELDS.map((field) => {
          const isActive = currentSortId === field.id;
          const dirLabel = t(`${field.id}.${currentDesc ? "desc" : "asc"}`);

          return (
            <Button
              key={field.id}
              variant={isActive ? "activeSoft" : "outline"}
              size="xl"
              onClick={() => handleSelect(field)}
              aria-pressed={isActive}
              className="w-full justify-start gap-2.5 px-3.5"
            >
              <span className="flex-1 text-left font-normal">{t(`${field.id}.label`)}</span>
              {isActive && (
                <>
                  <span className="shrink-0 text-xs font-medium">{dirLabel}</span>
                  <Icon strokeWidth={2.5} className="size-3.5 shrink-0" />
                </>
              )}
            </Button>
          );
        })}
      </div>
    </SheetDialog>
  );
};
