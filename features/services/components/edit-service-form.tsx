"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { SERVICE_LIMITS, type TEditServiceInput } from "@/features/services/schema";

type TProps = {
  form: UseFormReturn<TEditServiceInput>;
  nameRequired: boolean;
};

export const EditServiceForm = ({ form, nameRequired }: TProps) => {
  const t = useTranslations("services.editService");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  return (
    <Form {...form}>
      <FormFields>
        <FormTextField
          control={control}
          name="name"
          label={t("name.label")}
          placeholder={t("name.placeholder")}
          description={t("name.hint")}
          maxLength={SERVICE_LIMITS.name}
          required={nameRequired}
        />

        <FormTextareaField
          control={control}
          name="notes"
          label={t("notes.label")}
          placeholder={t("notes.placeholder")}
          maxLength={SERVICE_LIMITS.notes}
          rows={4}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
