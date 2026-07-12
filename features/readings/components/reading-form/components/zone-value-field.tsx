"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Control, type FieldPath } from "react-hook-form";

import { FormTextField } from "@/components/form/form-text-field";
import { formatReadingDelta, formatReadingNumber } from "@/features/readings/format";
import type { TReadingFormValues } from "@/features/readings/schema";
import type { TZoneState } from "@/features/readings/types";
import { zoneTintStyle } from "@/lib/constants/zones";

type TProps = {
  control: Control<TReadingFormValues>;
  name: FieldPath<TReadingFormValues>;
  label: string;
  placeholder: string;
  unit: string;
  zoneIndex: number;
  zoneState: TZoneState;
  lastReadingDate: string | null;
  compact: boolean;
};

export const ZoneValueField = ({
  control,
  name,
  label,
  placeholder,
  unit,
  zoneIndex,
  zoneState,
  lastReadingDate,
  compact,
}: TProps) => {
  const t = useTranslations("readings.form");
  const { lastValue, warning, delta } = zoneState;

  return (
    <div>
      <FormTextField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        type="number"
        inputMode="decimal"
        step="any"
        min="0"
        adornment={unit}
        inputClassName="tabular-nums"
        inputStyle={zoneTintStyle(zoneIndex)}
        required
      />

      {warning ? (
        <p className="text-warning mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed">
          <AlertTriangle size={13} strokeWidth={2} className="mt-px shrink-0" />
          <span>
            {t(compact ? "warning.short" : "warning.full", {
              value: formatReadingNumber(lastValue ?? 0),
            })}
          </span>
        </p>
      ) : (
        <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
          {lastReadingDate && lastValue !== null ? (
            <>
              {t(compact ? "hint.lastShort" : "hint.last", {
                value: formatReadingNumber(lastValue),
                date: lastReadingDate,
              })}
              {delta !== null && (
                <span className="text-success font-medium">
                  {" · "}
                  {t("hint.delta", { delta: formatReadingDelta(delta), unit })}
                </span>
              )}
            </>
          ) : (
            t("hint.noPrevious")
          )}
        </p>
      )}
    </div>
  );
};
