"use client";

import { useTranslations } from "next-intl";
import { type Control, useWatch } from "react-hook-form";
import { TriangleAlert } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormDayOfMonthField } from "@/components/form/form-day-of-month-field";

import { REMINDER_ANCHOR_TYPES } from "@/lib/db/schema/notifications";
import {
  REMINDER_DAYS_BEFORE_END_PRESETS,
  REMINDER_LAST_DAY_FALLBACK_DAYS,
} from "../../../constants";
import type { TReminderFormValues } from "../../../schema";
import { ReminderFormField } from "../../../types";
import { ModeRadioCard } from "./mode-radio-card";

type TProps = {
  control: Control<TReminderFormValues>;
  onAnchorTypeChange: (next: TReminderFormValues["anchorType"]) => void;
};

const isAnchorType = (value: string): value is TReminderFormValues["anchorType"] =>
  value === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH || value === REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END;

export const AnchorField = ({ control, onAnchorTypeChange }: TProps) => {
  const t = useTranslations("reminders.fields");
  const tPreset = useTranslations("reminders.fields.preset");

  const anchorType = useWatch({ control, name: ReminderFormField.ANCHOR_TYPE });
  const anchorValue = useWatch({ control, name: ReminderFormField.ANCHOR_VALUE });

  const presetOptions = REMINDER_DAYS_BEFORE_END_PRESETS.map((days) => ({
    id: String(days),
    name: days === 0 ? tPreset("lastDay") : tPreset("daysBefore", { days }),
  }));

  const showClampHint = REMINDER_LAST_DAY_FALLBACK_DAYS.includes(Number(anchorValue));

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("mode.label")}</Label>
      <RadioGroup
        value={anchorType}
        onValueChange={(value) => isAnchorType(value) && onAnchorTypeChange(value)}
      >
        <ModeRadioCard
          value={REMINDER_ANCHOR_TYPES.DAY_OF_MONTH}
          id="reminder-anchor-day"
          label={t("mode.dayOfMonth")}
          active={anchorType === REMINDER_ANCHOR_TYPES.DAY_OF_MONTH}
        >
          <FormDayOfMonthField
            control={control}
            name={ReminderFormField.ANCHOR_VALUE}
            label={t("day.label")}
            pickerHeading={t("day.pickerHeading")}
            clampNote={t("day.clampNote")}
          />
          {showClampHint ? (
            <div className="border-brand-border bg-brand-bg mt-2 flex items-start gap-2 rounded-md border px-2.5 py-2">
              <TriangleAlert className="text-brand mt-px size-3.5 shrink-0" />
              <span className="text-foreground text-xs leading-relaxed">{t("day.hint")}</span>
            </div>
          ) : null}
        </ModeRadioCard>

        <ModeRadioCard
          value={REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END}
          id="reminder-anchor-before-end"
          label={t("mode.daysBeforeEnd")}
          active={anchorType === REMINDER_ANCHOR_TYPES.DAYS_BEFORE_END}
        >
          <FormSelectField
            control={control}
            name={ReminderFormField.ANCHOR_VALUE}
            label={t("preset.label")}
            options={presetOptions}
          />
        </ModeRadioCard>
      </RadioGroup>
    </div>
  );
};
