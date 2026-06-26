"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { type TUpdateMode } from "../types";

type TProps = {
  value: TUpdateMode;
  selected: TUpdateMode;
  onSelect: (value: TUpdateMode) => void;
  label: string;
  helper: string;
  children?: ReactNode;
};

export const RadioOption = ({ value, selected, onSelect, label, helper, children }: TProps) => {
  const isActive = value === selected;

  return (
    <div
      className={cn(
        "rounded-lg border-[1.5px] transition-colors",
        isActive ? "border-primary" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(value)}
        aria-pressed={isActive}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          aria-hidden
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isActive ? "border-primary bg-primary" : "border-muted-foreground/40",
          )}
        >
          {isActive && <span className="bg-primary-foreground size-1.5 rounded-full" />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="text-foreground block text-sm font-semibold">{label}</span>
          <span className="text-muted-foreground block text-xs">{helper}</span>
        </span>
      </button>

      {isActive && children ? (
        <div className="border-primary/20 mx-4 mb-4 border-t pt-4">{children}</div>
      ) : null}
    </div>
  );
};
