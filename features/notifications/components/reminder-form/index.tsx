"use client";

import { useTranslations } from "next-intl";
import { type Control, useWatch } from "react-hook-form";

import { FormFields } from "@/components/form/form-fields";
import { FormTextareaField } from "@/components/form/form-textarea-field";

import { REMINDER_LIMITS } from "../../schema";
import type { TReminderFormValues } from "../../schema";
import { ReminderFormField } from "../../types";
import { AnchorField } from "./components/anchor-field";

type TProps = {
  control: Control<TReminderFormValues>;
  onAnchorTypeChange: (next: TReminderFormValues["anchorType"]) => void;
};

export const ReminderForm = ({ control, onAnchorTypeChange }: TProps) => {
  const t = useTranslations("reminders.fields");
  const text = useWatch({ control, name: ReminderFormField.TEXT });

  return (
    <FormFields>
      <AnchorField control={control} onAnchorTypeChange={onAnchorTypeChange} />

      <div>
        <FormTextareaField
          control={control}
          name={ReminderFormField.TEXT}
          label={t("text.label")}
          placeholder={t("text.placeholder")}
          maxLength={REMINDER_LIMITS.text}
          rows={3}
        />
        <div className="text-muted-foreground mt-1 text-right text-xs tabular-nums">
          {String(text ?? "").length}/{REMINDER_LIMITS.text}
        </div>
      </div>
    </FormFields>
  );
};
