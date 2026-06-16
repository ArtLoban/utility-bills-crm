"use client";

import { useTranslations } from "next-intl";
import { type Control, useWatch } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSelectField } from "@/components/form/form-select-field";

import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import {
  REMINDER_DAY_OPTIONS,
  REMINDER_DAYS_BEFORE_END_PRESETS,
  REMINDER_LAST_DAY_FALLBACK_DAYS,
} from "../../../constants";
import type { TReminderFormValues } from "../../../schema";
import { ReminderFormField } from "../../../types";

type TProps = {
  control: Control<TReminderFormValues>;
  onAnchorTypeChange: (next: TReminderFormValues["anchorType"]) => void;
};

const MODE_ITEMS = [
  {
    value: REMINDER_ANCHOR_TYPES.DAY_OF_MONTH,
    id: "reminder-anchor-day",
    labelKey: "mode.dayOfMonth",
  },
  {
    value: REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END,
    id: "reminder-anchor-before-end",
    labelKey: "mode.daysBeforeEnd",
  },
] as const;

const isAnchorType = (value: string): value is TReminderFormValues["anchorType"] =>
  value === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH || value === REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END;

export const AnchorField = ({ control, onAnchorTypeChange }: TProps) => {
  const t = useTranslations("reminders.fields");
  const tPreset = useTranslations("reminders.fields.preset");

  const anchorType = useWatch({ control, name: ReminderFormField.ANCHOR_TYPE });
  const anchorValue = useWatch({ control, name: ReminderFormField.ANCHOR_VALUE });

  const isDayMode = anchorType === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH;

  const dayOptions = REMINDER_DAY_OPTIONS.map((day) => ({ id: String(day), name: String(day) }));
  const presetOptions = REMINDER_DAYS_BEFORE_END_PRESETS.map((days) => ({
    id: String(days),
    name: days === 0 ? tPreset("lastDay") : tPreset("daysBefore", { days }),
  }));

  const dayHint = REMINDER_LAST_DAY_FALLBACK_DAYS.includes(Number(anchorValue))
    ? t("day.hint")
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>{t("mode.label")}</Label>
        <RadioGroup
          value={anchorType}
          onValueChange={(value) => isAnchorType(value) && onAnchorTypeChange(value)}
        >
          {MODE_ITEMS.map(({ value, id, labelKey }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={id} />
              <Label htmlFor={id} className="cursor-pointer font-normal">
                {t(labelKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {isDayMode ? (
        <FormSelectField
          control={control}
          name={ReminderFormField.ANCHOR_VALUE}
          label={t("day.label")}
          description={dayHint}
          options={dayOptions}
        />
      ) : (
        <FormSelectField
          control={control}
          name={ReminderFormField.ANCHOR_VALUE}
          label={t("preset.label")}
          options={presetOptions}
        />
      )}
    </div>
  );
};
