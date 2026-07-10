"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { UNIT_LABELS, zoneLabelKeys } from "@/lib/constants/zones";
import { todayIso } from "@/lib/format/date";
import { READING_LIMITS, type TReadingFormValues } from "@/features/readings/schema";
import {
  ReadingFormField,
  READING_ZONES,
  type TReadingZone,
  type TZoneField,
  type TZoneState,
} from "@/features/readings/types";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { MeterContext } from "./components/meter-context";
import { ZoneValueField } from "./components/zone-value-field";

type TProps = {
  form: UseFormReturn<TReadingFormValues>;
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  zoneStates: Record<TZoneField, TZoneState>;
  lastReadingDate: string | null;
};

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

export const ReadingForm = ({
  form,
  meter,
  serviceType,
  propertyName,
  zoneStates,
  lastReadingDate,
}: TProps) => {
  const t = useTranslations("readings.form");
  const tZones = useTranslations("zones");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const { zoneCount } = meter;
  const isSingleZone = zoneCount === 1;
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : t("unitFallback");
  const placeholder = t("fields.value.placeholder");
  const zones = READING_ZONES.slice(0, zoneCount);
  const labelKeys = zoneLabelKeys(zoneCount);

  const renderZone = (zone: TReadingZone, index: number) => (
    <ZoneValueField
      key={zone.field}
      control={control}
      name={zone.field}
      label={
        isSingleZone
          ? t("fields.value.label", { unit: unitLabel })
          : t("fields.value.labelZone", {
              label: tZones((labelKeys[index] ?? "single") as Parameters<typeof tZones>[0]),
              unit: unitLabel,
            })
      }
      placeholder={placeholder}
      unit={unitLabel}
      zoneState={zoneStates[zone.field]}
      lastReadingDate={lastReadingDate}
      compact={!isSingleZone}
    />
  );

  return (
    <Form {...form}>
      <FormFields>
        <MeterContext meter={meter} serviceType={serviceType} propertyName={propertyName} />

        <FormDateField
          control={control}
          name={ReadingFormField.READ_AT}
          label={t("fields.readAt.label")}
          max={todayIso()}
          required
        />

        {isSingleZone ? (
          renderZone(READING_ZONES[0], 0)
        ) : (
          <div className={`grid gap-3 ${GRID_COLS[zoneCount]}`}>{zones.map(renderZone)}</div>
        )}

        <FormTextareaField
          control={control}
          name={ReadingFormField.NOTES}
          label={t("fields.notes.label")}
          placeholder={t("fields.notes.placeholder")}
          maxLength={READING_LIMITS.notes}
          rows={2}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
