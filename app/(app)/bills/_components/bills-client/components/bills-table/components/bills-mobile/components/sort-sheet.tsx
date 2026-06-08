import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TBillSortColumn } from "@/features/bills";
import { SORT_FIELDS, type TSortField } from "../constants";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSortId: string;
  currentDesc: boolean;
  onSort: (id: TBillSortColumn, desc: boolean) => void;
};

const SortSheet = ({ open, onOpenChange, currentSortId, currentDesc, onSort }: TProps) => {
  const handleSelect = (field: TSortField) => {
    const isSame = currentSortId === field.id;
    const nextDesc = isSame ? !currentDesc : field.defaultDesc;
    onSort(field.id, nextDesc);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="px-4 pb-7">
          {/* Header */}
          <div className="flex items-center justify-between pt-2.5 pb-4">
            <SheetTitle className="text-[15px] font-semibold">Sort by</SheetTitle>
            <SheetClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-0">
              <X size={16} className="text-zinc-500 dark:text-zinc-400" />
            </SheetClose>
          </div>

          {/* Sort options */}
          <div className="flex flex-col gap-2">
            {SORT_FIELDS.map((field) => {
              const isActive = currentSortId === field.id;
              const dirLabel = currentDesc ? field.descLabel : field.ascLabel;

              return (
                <button
                  key={field.id}
                  onClick={() => handleSelect(field)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3.5 py-3"
                  style={{
                    border: `1px solid ${isActive ? "var(--field-tint-border)" : "var(--border)"}`,
                    background: isActive ? "var(--field-tint-bg)" : "transparent",
                  }}
                >
                  <span
                    className={`flex-1 text-left text-sm ${isActive ? "font-semibold" : "text-foreground font-normal"}`}
                    style={isActive ? { color: "var(--field-tint-fg)" } : {}}
                  >
                    {field.label}
                  </span>
                  {isActive && (
                    <>
                      <span
                        className="shrink-0 text-xs font-medium"
                        style={{ color: "var(--field-tint-fg)" }}
                      >
                        {dirLabel}
                      </span>
                      {currentDesc ? (
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className="shrink-0"
                          style={{ color: "var(--field-tint-fg)" }}
                        />
                      ) : (
                        <ChevronUp
                          size={14}
                          strokeWidth={2.5}
                          className="shrink-0"
                          style={{ color: "var(--field-tint-fg)" }}
                        />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { SortSheet };
