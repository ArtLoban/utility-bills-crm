"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { SheetDialog } from "@/components/sheet-dialog";
import { Button } from "@/components/ui/button";

import { SORT_FIELDS, type TMobileSortColumn, type TSortField } from "../constants";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSortId: TMobileSortColumn;
  currentDesc: boolean;
  onSort: (id: TMobileSortColumn, desc: boolean) => void;
};

export const SortSheet = ({ open, onOpenChange, currentSortId, currentDesc, onSort }: TProps) => {
  const handleSelect = (field: TSortField) => {
    const isSame = currentSortId === field.id;
    const nextDesc = isSame ? !currentDesc : field.defaultDesc;
    onSort(field.id, nextDesc);
    onOpenChange(false);
  };

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  return (
    <SheetDialog title="Sort by" open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        {SORT_FIELDS.map((field) => {
          const isActive = currentSortId === field.id;
          const dirLabel = currentDesc ? field.descLabel : field.ascLabel;

          return (
            <Button
              key={field.id}
              variant={isActive ? "activeSoft" : "outline"}
              size="xl"
              onClick={() => handleSelect(field)}
              aria-pressed={isActive}
              className="w-full justify-start gap-2.5 px-3.5"
            >
              <span className="flex-1 text-left font-normal">{field.label}</span>
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
