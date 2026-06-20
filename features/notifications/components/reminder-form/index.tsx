"use client";

import { useTranslations } from "next-intl";
import { type Control } from "react-hook-form";
import { Send } from "lucide-react";

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

  return (
    <FormFields>
      <AnchorField control={control} onAnchorTypeChange={onAnchorTypeChange} />

      <FormTextareaField
        control={control}
        name={ReminderFormField.TEXT}
        label={t("text.label")}
        placeholder={t("text.placeholder")}
        maxLength={REMINDER_LIMITS.text}
        rows={3}
        showCounter
        description={
          <span className="flex items-center gap-1.5">
            <Send size={12} className="shrink-0" />
            {t("text.deliveryHint")}
          </span>
        }
      />
    </FormFields>
  );
};
