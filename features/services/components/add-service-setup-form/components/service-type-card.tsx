"use client";

import type { ElementType } from "react";

import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  serviceType: TServiceType;
  Icon: ElementType;
  color: string;
  label: string;
  measurementLabel: string;
  isSelected: boolean;
  isDisabled: boolean;
  addedBadgeLabel: string;
  onClick: () => void;
};

export const ServiceTypeCard = ({
  Icon,
  color,
  label,
  measurementLabel,
  isSelected,
  isDisabled,
  addedBadgeLabel,
  onClick,
}: TProps) => {
  if (isDisabled) {
    return (
      <div
        className="relative flex cursor-not-allowed items-center gap-3 rounded-lg p-3.5 opacity-50"
        style={{ border: "1px solid var(--border)", background: "var(--muted)" }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
        >
          <Icon size={18} style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground truncate text-[13.5px] font-semibold">{label}</div>
          <div className="text-muted-foreground/60 mt-0.5 text-[11px] font-medium tracking-wide uppercase">
            {measurementLabel}
          </div>
        </div>
        <span
          className="absolute -top-2 -right-2 rounded-full px-2 py-px text-[10.5px] font-semibold"
          style={{
            background: "var(--muted-foreground)",
            color: "var(--background)",
            boxShadow: "0 0 0 2px var(--background)",
          }}
        >
          {addedBadgeLabel}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex cursor-pointer items-center gap-3 rounded-lg p-3.5 transition-[border-color,background-color] duration-150"
      style={{
        border: isSelected ? `1.5px solid ${color}` : "1px solid var(--border)",
        background: isSelected ? `color-mix(in srgb, ${color} 8%, transparent)` : "var(--card)",
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-[border-color,background-color] duration-150"
        style={{
          background: isSelected ? `color-mix(in srgb, ${color} 18%, transparent)` : "var(--muted)",
          border: isSelected
            ? `1px solid color-mix(in srgb, ${color} 35%, transparent)`
            : "1px solid var(--border)",
        }}
      >
        <Icon size={18} style={{ color: isSelected ? color : "var(--muted-foreground)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-[13.5px] font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {label}
        </div>
        <div
          className="mt-0.5 text-[11px] font-medium tracking-wide uppercase"
          style={{ color: "var(--muted-foreground)" }}
        >
          {measurementLabel}
        </div>
      </div>
      {isSelected && (
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: color }}
        >
          <svg
            width={11}
            height={11}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
    </button>
  );
};
