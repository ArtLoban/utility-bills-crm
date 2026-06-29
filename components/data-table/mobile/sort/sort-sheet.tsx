import { ChevronDown, ChevronUp } from "lucide-react";

import { SheetDialog } from "@/components/sheet-dialog";
import { Button } from "@/components/ui/button";

export type TSortOption = {
  id: string;
  defaultDesc: boolean;
  label: string;
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: readonly TSortOption[];
  currentSortId: string;
  currentDesc: boolean;
  dirLabel: string;
  onSort: (id: string, desc: boolean) => void;
};

export const SortSheet = ({
  open,
  onOpenChange,
  title,
  options,
  currentSortId,
  currentDesc,
  dirLabel,
  onSort,
}: TProps) => {
  const handleSelect = (option: TSortOption) => {
    const isSame = currentSortId === option.id;
    const nextDesc = isSame ? !currentDesc : option.defaultDesc;
    onSort(option.id, nextDesc);
    onOpenChange(false);
  };

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  return (
    <SheetDialog title={title} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isActive = currentSortId === option.id;

          return (
            <Button
              key={option.id}
              variant={isActive ? "activeSoft" : "outline"}
              size="xl"
              onClick={() => handleSelect(option)}
              aria-pressed={isActive}
              className="w-full justify-start gap-2.5 px-3.5"
            >
              <span className="flex-1 text-left font-normal">{option.label}</span>
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
