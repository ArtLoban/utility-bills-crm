"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TFormValues } from "../schema";
import { MeterEngagementRow } from "./meter-engagement-row";
import { ZoneSelector } from "./zone-selector";

type TProps = {
  selectedType: TServiceType;
  engaged: boolean;
  onToggle: (v: boolean) => void;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export const MeterSection = ({ selectedType, engaged, onToggle, control, errors }: TProps) => {
  const t = useTranslations("services.serviceForm");

  return (
    <div className="flex flex-col gap-4">
      <MeterEngagementRow
        title={t("meterRow.title")}
        desc={t("meterRow.desc")}
        engaged={engaged}
        onToggle={onToggle}
      />

      {engaged && (
        <>
          <FormField label={t("fields.zoneCount.label")}>
            <Controller
              name="meter.zoneCount"
              control={control}
              shouldUnregister
              render={({ field }) => (
                <ZoneSelector
                  value={(field.value as 1 | 2 | 3) ?? 1}
                  onChange={field.onChange}
                  supportsZones={selectedType.supportsZones}
                />
              )}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label={t("fields.serialNumber.label")} optional>
              <Controller
                name="meter.serialNumber"
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <Input
                    placeholder={t("fields.serialNumber.placeholder")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormField>

            <FormField label={t("fields.installedAt.label")} optional>
              <div className="relative">
                <Controller
                  name="meter.installedAt"
                  control={control}
                  shouldUnregister
                  render={({ field }) => (
                    <Input
                      type="date"
                      className="h-9 pl-9"
                      value={field.value ?? ""}
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
          </div>

          <FormField
            label={t("fields.meterValidFrom.label")}
            error={errors.meter?.meterValidFrom?.message}
          >
            <div className="relative">
              <Controller
                name="meter.meterValidFrom"
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <Input
                    type="date"
                    className="h-9 pl-9"
                    value={field.value ?? ""}
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

          <FormField label={t("fields.meterNotes.label")} optional>
            <Controller
              name="meter.meterNotes"
              control={control}
              shouldUnregister
              render={({ field }) => (
                <Textarea
                  placeholder={t("fields.meterNotes.placeholder")}
                  rows={3}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </>
      )}
    </div>
  );
};
