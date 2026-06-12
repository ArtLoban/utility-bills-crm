import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TBillSortColumn } from "@/features/bills";
import { SORT_FIELDS, type TSortField } from "../constants";
import { SheetDialog } from "@/components/sheet-dialog";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSortId: TBillSortColumn;
  currentDesc: boolean;
  onSort: (id: TBillSortColumn, desc: boolean) => void;
};

export const SortSheet = ({ open, onOpenChange, currentSortId, currentDesc, onSort }: TProps) => {
  const t = useTranslations("bills.list.sort");

  const handleSelect = (field: TSortField) => {
    const isSame = currentSortId === field.id;
    const nextDesc = isSame ? !currentDesc : field.defaultDesc;
    onSort(field.id, nextDesc);
    onOpenChange(false);
  };

  return (
    <SheetDialog title={t("title")} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        {SORT_FIELDS.map((field) => {
          const isActive = currentSortId === field.id;
          const dirLabel = t(`${field.id}.${currentDesc ? "desc" : "asc"}`);

          return (
            <button
              key={field.id}
              onClick={() => handleSelect(field)}
              aria-pressed={isActive}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3.5 py-3"
              style={{
                border: `1px solid ${isActive ? "var(--field-tint-border)" : "var(--border)"}`,
                background: isActive ? "var(--field-tint-bg)" : "transparent",
              }}
            >
              <span
                className={`flex-1 text-left text-sm ${isActive ? "font-semibold" : "text-foreground font-normal"}`}
                style={isActive ? { color: "var(--field-tint-fg)" } : undefined}
              >
                {t(`${field.id}.label`)}
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
    </SheetDialog>
  );
};
