"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { PROVIDER_LIMITS, type TProviderInput } from "@/features/providers/schema";
import { ProviderFormField } from "@/features/providers/types";

type TProps = {
  form: UseFormReturn<TProviderInput>;
};

export const ProviderForm = ({ form }: TProps) => {
  const t = useTranslations("providers.fields");
  const { control } = form;
  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <FormFields>
        <FormTextField
          control={control}
          name={ProviderFormField.NAME}
          label={t("name.label")}
          placeholder={t("name.placeholder")}
          maxLength={PROVIDER_LIMITS.name}
          required
        />

        <FormTextField
          control={control}
          name={ProviderFormField.WEBSITE}
          label={t("website.label")}
          placeholder={t("website.placeholder")}
          maxLength={PROVIDER_LIMITS.website}
        />

        <FormTextField
          control={control}
          name={ProviderFormField.PHONE}
          label={t("phone.label")}
          placeholder={t("phone.placeholder")}
          maxLength={PROVIDER_LIMITS.phone}
        />

        <FormTextareaField
          control={control}
          name={ProviderFormField.NOTES}
          label={t("notes.label")}
          placeholder={t("notes.placeholder")}
          maxLength={PROVIDER_LIMITS.notes}
          rows={3}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
