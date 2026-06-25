"use client";

import { type KeyboardEvent, type Ref } from "react";
import { type LucideIcon } from "lucide-react";

type TProps = {
  label: string;
  Icon: LucideIcon;
  isSelected: boolean;
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
};

export const PropertyTypeCard = ({
  label,
  Icon,
  isSelected,
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
    className="group not-data-[selected]:hover:text-foreground focus-visible:ring-ring/50 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-[var(--type-card-border)] bg-[var(--type-card-bg)] px-2 py-2.5 text-[var(--muted-foreground)] transition-[color,border-color,background-color] duration-150 outline-none not-data-[selected]:hover:bg-[var(--type-card-hover-bg)] focus-visible:ring-2 data-[selected]:border-[var(--field-tint-border)] data-[selected]:bg-[var(--field-tint-bg)] data-[selected]:text-[var(--field-tint-fg)]"
  >
    <Icon size={20} />
    <span className="text-xs group-data-[selected]:font-medium">{label}</span>
  </button>
);
