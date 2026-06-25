"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { FormSelectField } from "@/components/form/form-select-field";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { CONTRACT_LIMITS } from "@/features/contracts/schema";
import { ROUTES } from "@/lib/routes";
import type { TProvider } from "@/lib/db/schema/providers";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";

type TProps = {
  control: Control<TServiceSetupForm>;
  providers: TProvider[];
};

export const ContractSection = ({ control, providers }: TProps) => {
  const t = useTranslations("services.serviceForm");
  const hasProviders = providers.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FormSelectField
          control={control}
          name={ServiceSetupFormField.PROVIDER_ID}
          label={t("fields.provider.label")}
          placeholder={hasProviders ? t("fields.provider.placeholder") : t("noProviders.before")}
          options={hasProviders ? providers : []}
          disabled={!hasProviders}
          required
        />
        {hasProviders ? null : (
          <div className="bg-primary/10 border-primary/20 mt-2 flex items-start gap-2.5 rounded-md border p-3">
            <Info size={15} className="text-primary mt-px shrink-0" />
            <p className="text-xs leading-relaxed">
              {t("noProviders.before")}{" "}
              <Link href={ROUTES.providers} className="text-primary font-medium underline">
                {t("noProviders.link")}
              </Link>{" "}
              {t("noProviders.after")}
            </p>
          </div>
        )}
      </div>

      <FormDateField
        control={control}
        name={ServiceSetupFormField.CONTRACT_VALID_FROM}
        label={t("fields.contractValidFrom.label")}
        required
      />

      <FormTextareaField
        control={control}
        name={ServiceSetupFormField.CONTRACT_NOTES}
        label={t("fields.contractNotes.label")}
        placeholder={t("fields.contractNotes.placeholder")}
        maxLength={CONTRACT_LIMITS.notes}
        rows={3}
      />
    </div>
  );
};
