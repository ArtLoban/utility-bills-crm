"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { METER_LIMITS } from "@/features/meters/schema";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ServiceMeterField } from "../schema";
import type { TServiceSetupForm } from "../schema";
import { MeterEngagementRow } from "./meter-engagement-row";
import { ZoneSelector } from "./zone-selector";

type TProps = {
  control: Control<TServiceSetupForm>;
  selectedType: TServiceType;
  engaged: boolean;
  onToggle: (engaged: boolean) => void;
};

export const MeterSection = ({ control, selectedType, engaged, onToggle }: TProps) => {
  const t = useTranslations("services.serviceForm");

  return (
    <div className="flex flex-col gap-4">
      <MeterEngagementRow
        title={t("meterRow.title")}
        desc={t("meterRow.desc")}
        engaged={engaged}
        onToggle={onToggle}
      />

      {engaged ? (
        <>
          <FormField
            control={control}
            name={ServiceMeterField.ZONE_COUNT}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.zoneCount.label")}</FormLabel>
                <FormControl>
                  <ZoneSelector
                    value={field.value}
                    onChange={field.onChange}
                    supportsZones={selectedType.supportsZones}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormTextField
              control={control}
              name={ServiceMeterField.SERIAL_NUMBER}
              label={t("fields.serialNumber.label")}
              placeholder={t("fields.serialNumber.placeholder")}
              maxLength={METER_LIMITS.serialNumber}
            />

            <FormDateField
              control={control}
              name={ServiceMeterField.INSTALLED_AT}
              label={t("fields.installedAt.label")}
            />
          </div>

          <FormDateField
            control={control}
            name={ServiceMeterField.METER_VALID_FROM}
            label={t("fields.meterValidFrom.label")}
            required
          />

          <FormTextareaField
            control={control}
            name={ServiceMeterField.METER_NOTES}
            label={t("fields.meterNotes.label")}
            placeholder={t("fields.meterNotes.placeholder")}
            maxLength={METER_LIMITS.notes}
            rows={3}
          />
        </>
      ) : null}
    </div>
  );
};
