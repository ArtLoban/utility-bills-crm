"use client";

import { type KeyboardEvent, type Ref } from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TProps = {
  label: string;
  measurementLabel: string;
  Icon: LucideIcon;
  color: string;
  isSelected: boolean;
  isAdded: boolean;
  addedBadgeLabel: string;
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
};

export const ServiceTypeCard = ({
  label,
  measurementLabel,
  Icon,
  color,
  isSelected,
  isAdded,
  addedBadgeLabel,
  tabIndex,
  onSelect,
  onKeyDown,
  ref,
}: TProps) => (
  <button
    ref={ref}
    type="button"
    role="radio"
    aria-checked={isSelected}
    tabIndex={tabIndex}
    data-selected={isSelected || undefined}
    onClick={onSelect}
    onKeyDown={onKeyDown}
    style={
      isSelected
        ? { borderColor: color, background: `color-mix(in srgb, ${color} 8%, transparent)` }
        : undefined
    }
    className="focus-visible:ring-ring/50 bg-card not-data-[selected]:border-border not-data-[selected]:hover:bg-muted relative flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-left transition-[color,border-color,background-color] duration-150 outline-none focus-visible:ring-2"
  >
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-[border-color,background-color] duration-150",
        !isSelected && "bg-muted border-border",
      )}
      style={
        isSelected
          ? {
              background: `color-mix(in srgb, ${color} 18%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
            }
          : undefined
      }
    >
      <Icon
        size={18}
        className={cn(!isSelected && "text-muted-foreground")}
        style={isSelected ? { color } : undefined}
      />
    </div>

    <div className="min-w-0 flex-1">
      <div className="text-foreground truncate text-sm font-semibold">{label}</div>
      <div className="text-muted-foreground mt-0.5 text-xs font-medium tracking-wide uppercase">
        {measurementLabel}
      </div>
    </div>

    {isSelected ? (
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: color }}
      >
        <Check size={11} strokeWidth={3} className="text-white" />
      </div>
    ) : null}

    {isAdded ? (
      <span className="bg-muted-foreground text-background ring-background absolute -top-2 -right-2 rounded-full px-2 py-px text-xs font-semibold ring-2">
        {addedBadgeLabel}
      </span>
    ) : null}
  </button>
);
