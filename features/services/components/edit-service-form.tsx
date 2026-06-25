"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { SERVICE_LIMITS, type TEditServiceInput } from "@/features/services/schema";

type TProps = {
  form: UseFormReturn<TEditServiceInput>;
};

export const EditServiceForm = ({ form }: TProps) => {
  const t = useTranslations("services.editNotes");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  return (
    <Form {...form}>
      <FormFields>
        <FormTextareaField
          control={control}
          name="notes"
          label={t("label")}
          placeholder={t("placeholder")}
          maxLength={SERVICE_LIMITS.notes}
          rows={4}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
