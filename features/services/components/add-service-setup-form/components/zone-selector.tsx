"use client";

import { type KeyboardEvent, useRef } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const ZONE_OPTIONS = [1, 2, 3] as const;

type TProps = {
  value: 1 | 2 | 3;
  onChange: (value: 1 | 2 | 3) => void;
  supportsZones: boolean;
};

export const ZoneSelector = ({ value, onChange, supportsZones }: TProps) => {
  const t = useTranslations("services.serviceForm");
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  if (!supportsZones) {
    return (
      <div className="bg-muted flex items-center gap-2.5 rounded-md border px-3.5 py-2.5">
        <span className="text-muted-foreground text-sm">{t("hint.noZoneSupport")}</span>
      </div>
    );
  }

  const selectedIndex = ZONE_OPTIONS.indexOf(value);
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const moveTo = (index: number) => {
    const nextIndex = (index + ZONE_OPTIONS.length) % ZONE_OPTIONS.length;
    const nextZone = ZONE_OPTIONS[nextIndex];
    if (nextZone === undefined) return;
    onChange(nextZone);
    buttonsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(index - 1);
        break;
    }
  };

  return (
    <div role="radiogroup" aria-label={t("fields.zoneCount.label")} className="flex gap-2">
      {ZONE_OPTIONS.map((zone, index) => {
        const isSelected = value === zone;
        return (
          <button
            key={zone}
            ref={(element) => {
              buttonsRef.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={index === tabbableIndex ? 0 : -1}
            onClick={() => onChange(zone)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "focus-visible:ring-ring/50 h-9 w-14 rounded-md border text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:border-primary/50",
            )}
          >
            {zone}
          </button>
        );
      })}
    </div>
  );
};
