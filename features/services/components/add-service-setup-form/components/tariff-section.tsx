"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ZONE_LABELS } from "../constants";
import type { TFormValues } from "../schema";

type TProps = {
  selectedType: TServiceType | null;
  effectiveZoneCount: 1 | 2 | 3;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export const TariffSection = ({ selectedType, effectiveZoneCount, control, errors }: TProps) => {
  const t = useTranslations("services.serviceForm");

  const isFixed = selectedType?.measurementType === "fixed";
  const isMetered = selectedType?.measurementType === "metered";
  const supportsZones = selectedType?.supportsZones ?? false;

  const rateFields = (["rateT1", "rateT2", "rateT3"] as const).slice(0, effectiveZoneCount);
  const zoneLabels = ZONE_LABELS[effectiveZoneCount];

  return (
    <div className="flex flex-col gap-4">
      {isMetered ? (
        <div>
          <p className="mb-1.5 text-sm font-medium">
            {effectiveZoneCount === 1 ? t("fields.rate.label") : t("fields.rates.label")}
          </p>
          <div
            className="grid gap-2.5"
            style={{ gridTemplateColumns: `repeat(${effectiveZoneCount}, 1fr)` }}
          >
            {rateFields.map((fieldName, i) => (
              <div key={fieldName}>
                {effectiveZoneCount > 1 && (
                  <p className="text-muted-foreground mb-1 text-[11px] font-medium tracking-wide uppercase">
                    {t(`zoneLabels.${zoneLabels[i]}` as Parameters<typeof t>[0])}
                  </p>
                )}
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="0.00" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            ))}
          </div>
          {errors.rateT1 && (
            <p className="text-destructive mt-1 text-xs">{errors.rateT1.message}</p>
          )}
          {supportsZones && (
            <p className="text-muted-foreground mt-1.5 text-[12.5px]">
              {effectiveZoneCount === 1 ? t("hint.singleZone") : t("hint.multiZone")}
            </p>
          )}
        </div>
      ) : isFixed ? (
        <FormField label={t("fields.fixedAmount.label")} error={errors.fixedAmount?.message}>
          <div className="relative">
            <Controller
              name="fixedAmount"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={t("fields.fixedAmount.placeholder")}
                  className="pr-14"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              UAH
            </span>
          </div>
          <p className="text-muted-foreground mt-1.5 text-[12.5px]">{t("hint.fixedAmount")}</p>
        </FormField>
      ) : (
        // No type selected yet — neutral placeholder matching the inactive state appearance
        <FormField label={t("fields.rate.label")}>
          <Input placeholder="0.00" disabled />
        </FormField>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField
          label={t("fields.tariffValidFrom.label")}
          error={errors.tariffValidFrom?.message}
        >
          <div className="relative">
            <Controller
              name="tariffValidFrom"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  className="h-9 pl-9"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Calendar
              size={14}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
            />
          </div>
        </FormField>

        <FormField label={t("fields.tariffNotes.label")} optional>
          <Controller
            name="tariffNotes"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={t("fields.tariffNotes.placeholder")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>
    </div>
  );
};
