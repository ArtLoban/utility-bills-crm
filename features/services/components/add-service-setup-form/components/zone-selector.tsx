"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const ZONE_OPTIONS = [1, 2, 3] as const;

type TProps = {
  value: 1 | 2 | 3;
  onChange: (v: 1 | 2 | 3) => void;
  supportsZones: boolean;
};

export const ZoneSelector = ({ value, onChange, supportsZones }: TProps) => {
  const t = useTranslations("services.serviceForm");

  if (!supportsZones) {
    return (
      <div
        className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5"
        style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
      >
        <span className="text-muted-foreground text-sm">{t("hint.noZoneSupport")}</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {ZONE_OPTIONS.map((zone) => (
        <button
          key={zone}
          type="button"
          onClick={() => onChange(zone)}
          className={cn(
            "h-9 w-14 rounded-md border text-sm font-medium transition-colors duration-150",
            value === zone
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-background text-foreground hover:border-primary/50 border",
          )}
        >
          {zone}
        </button>
      ))}
    </div>
  );
};
