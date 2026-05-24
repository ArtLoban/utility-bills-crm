"use client";

import type { ElementType } from "react";

type TProps = {
  id: string;
  Icon: ElementType;
  color: string;
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export const ServiceTypeCard = ({
  Icon,
  color,
  label,
  isSelected,
  isDisabled,
  onClick,
}: TProps) => {
  if (isDisabled) {
    return (
      <div
        className="relative flex flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 opacity-40"
        style={{
          border: "1px solid var(--type-card-border)",
          background: "var(--type-card-bg)",
          cursor: "not-allowed",
        }}
      >
        <Icon size={20} className="text-zinc-400 dark:text-zinc-600" />
        <span className="text-center text-xs text-zinc-400 dark:text-zinc-600">{label}</span>
        <span
          className="absolute -top-2 -right-2 rounded-full px-1.5 py-px text-[10px] leading-tight font-semibold"
          style={{ background: "#e4e4e7", color: "#71717a" }}
        >
          Added
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 transition-[border-color,background-color] duration-150"
      style={{
        border: isSelected ? `1.5px solid ${color}55` : "1px solid var(--type-card-border)",
        background: isSelected
          ? `color-mix(in srgb, ${color} 10%, transparent)`
          : "var(--type-card-bg)",
      }}
    >
      <Icon size={20} style={{ color: isSelected ? color : "var(--muted-foreground)" }} />
      <span
        className={`text-center text-xs ${isSelected ? "font-medium" : "font-normal"}`}
        style={{ color: isSelected ? color : "var(--muted-foreground)" }}
      >
        {label}
      </span>
    </button>
  );
};
