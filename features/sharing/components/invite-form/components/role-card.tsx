"use client";

import { type KeyboardEvent, type Ref } from "react";

type TProps = {
  label: string;
  helper: string;
  isSelected: boolean;
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
};

export const RoleCard = ({
  label,
  helper,
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
    className="group focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-[var(--type-card-border)] bg-[var(--type-card-bg)] px-3.5 py-3 text-left transition-[color,border-color,background-color] duration-150 outline-none not-data-[selected]:hover:bg-[var(--type-card-hover-bg)] focus-visible:ring-2 data-[selected]:border-[var(--field-tint-border)] data-[selected]:bg-[var(--field-tint-bg)]"
  >
    <span className="border-input flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors group-data-[selected]:border-[var(--field-tint-fg)]">
      <span className="size-1.5 rounded-full bg-[var(--field-tint-fg)] opacity-0 transition-opacity group-data-[selected]:opacity-100" />
    </span>

    <span>
      <span className="text-foreground block text-sm font-semibold">{label}</span>
      <span className="text-muted-foreground mt-0.5 block text-xs">{helper}</span>
    </span>
  </button>
);
