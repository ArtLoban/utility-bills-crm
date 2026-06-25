"use client";

import { useTranslations } from "next-intl";
import { type Control } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { PROPERTY_LIMITS, type TPropertyInput } from "@/features/properties/schema";
import { PropertyFormField } from "@/features/properties/types";
import { PropertyTypeSelector } from "./components/property-type-selector";

type TProps = {
  control: Control<TPropertyInput>;
};

export const PropertyForm = ({ control }: TProps) => {
  const t = useTranslations("properties.fields");

  return (
    <FormFields>
      <FormTextField
        control={control}
        name={PropertyFormField.NAME}
        label={t("name.label")}
        placeholder={t("name.placeholder")}
        maxLength={PROPERTY_LIMITS.name}
      />

      <FormField
        control={control}
        name={PropertyFormField.TYPE}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("type.label")}</FormLabel>
            <PropertyTypeSelector value={field.value} onChange={field.onChange} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormTextField
        control={control}
        name={PropertyFormField.ADDRESS}
        label={t("address.label")}
        placeholder={t("address.placeholder")}
        maxLength={PROPERTY_LIMITS.address}
      />

      <FormTextareaField
        control={control}
        name={PropertyFormField.NOTES}
        label={t("notes.label")}
        placeholder={t("notes.placeholder")}
        maxLength={PROPERTY_LIMITS.notes}
        rows={3}
      />
    </FormFields>
  );
};
