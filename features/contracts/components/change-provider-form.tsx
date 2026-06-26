"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { CONTRACT_LIMITS, type TChangeProviderForm } from "@/features/contracts/schema";
import { ChangeProviderFormField } from "@/features/contracts/types";
import { ROUTES } from "@/lib/routes";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  form: UseFormReturn<TChangeProviderForm>;
  providers: TProvider[];
};

export const ChangeProviderForm = ({ form, providers }: TProps) => {
  const { control, formState } = form;
  const t = useTranslations("contracts");
  const rootError = formState.errors.root?.message;
  const hasOtherProviders = providers.length > 0;

  return (
    <Form {...form}>
      <FormFields>
        <div>
          <FormSelectField
            control={control}
            name={ChangeProviderFormField.NEW_PROVIDER_ID}
            label={t("fields.provider.label")}
            placeholder={t("fields.provider.placeholder")}
            options={providers}
            disabled={!hasOtherProviders}
            required
          />
          {hasOtherProviders ? null : (
            <div className="bg-primary/10 border-primary/20 mt-2 flex items-start gap-2.5 rounded-md border p-3">
              <Info size={15} className="text-primary mt-px shrink-0" />
              <p className="text-xs leading-relaxed">
                {t("noOtherProviders.message")}{" "}
                <Link href={ROUTES.providers} className="text-primary font-medium underline">
                  {t("noOtherProviders.link")}
                </Link>
              </p>
            </div>
          )}
        </div>

        <FormDateField
          control={control}
          name={ChangeProviderFormField.CHANGE_DATE}
          label={t("fields.changeDate.label")}
          required
        />

        <FormTextareaField
          control={control}
          name={ChangeProviderFormField.NOTES}
          label={t("fields.notes.label")}
          placeholder={t("fields.notes.placeholder")}
          maxLength={CONTRACT_LIMITS.notes}
          rows={3}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};
