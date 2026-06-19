"use client";

import { cn } from "@/lib/utils";

type TProps = {
  value: string;
  selected: string;
  onSelect: (value: string) => void;
  label: string;
  helper: string;
  children?: React.ReactNode;
};

export const RadioOption = ({ value, selected, onSelect, label, helper, children }: TProps) => {
  const isActive = value === selected;

  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        "cursor-pointer rounded-lg border-[1.5px] px-4 py-3.5 transition-colors",
        isActive ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isActive ? "border-primary bg-primary" : "border-muted-foreground/40",
          )}
        >
          {isActive && <div className="bg-primary-foreground size-1.5 rounded-full" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-foreground text-sm font-semibold">{label}</div>
          <div className="text-muted-foreground text-xs">{helper}</div>
        </div>
      </div>

      {isActive && children && (
        <div className="border-primary/20 mt-3.5 border-t pt-4">{children}</div>
      )}
    </div>
  );
};
