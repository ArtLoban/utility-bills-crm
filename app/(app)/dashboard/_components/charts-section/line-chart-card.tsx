"use client";

import type { ReactNode } from "react";

import { DataCard } from "@/components/data-card";

type TProps = {
  title: string;
  subtitle: string;
  isConsumptionMode: boolean;
  onMoneyMode: () => void;
  onConsumptionMode: () => void;
  moneyModeLabel: string;
  consumptionModeLabel: string;
  hasConsumptionData: boolean;
  servicePickerSlot?: ReactNode;
  moneySlot: ReactNode;
  consumptionSlot: ReactNode;
};

export const LineChartCard = ({
  title,
  subtitle,
  isConsumptionMode,
  onMoneyMode,
  onConsumptionMode,
  moneyModeLabel,
  consumptionModeLabel,
  hasConsumptionData,
  servicePickerSlot,
  moneySlot,
  consumptionSlot,
}: TProps) => (
  <DataCard className="p-5">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="flex items-center overflow-hidden rounded-[6px] border dark:border-zinc-700"
          style={{ height: 32 }}
        >
          {(
            [
              {
                mode: "money",
                label: moneyModeLabel,
                isActive: !isConsumptionMode,
                disabled: false,
              },
              {
                mode: "consumption",
                label: consumptionModeLabel,
                isActive: isConsumptionMode,
                disabled: !hasConsumptionData,
              },
            ] as const
          ).map(({ mode, label, isActive, disabled }) => (
            <button
              key={mode}
              type="button"
              disabled={disabled}
              onClick={mode === "money" ? onMoneyMode : onConsumptionMode}
              className="cursor-pointer px-3 text-[12.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                height: "100%",
                fontWeight: isActive ? 500 : 400,
                background: isActive ? "var(--background)" : "transparent",
                color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {servicePickerSlot}
      </div>
    </div>

    {isConsumptionMode ? consumptionSlot : moneySlot}
  </DataCard>
);
