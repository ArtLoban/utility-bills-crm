"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { PROVIDER_LIMITS } from "@/features/providers/schema";
import type { TFormState } from "@/features/providers/types";

type TProps = {
  form: TFormState;
  errors: Record<string, string>;
  formError?: string | null;
  set: (key: keyof TFormState) => (value: string) => void;
};

export const ProviderForm = ({ form, errors, formError, set }: TProps) => {
  const t = useTranslations("providers");

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("fields.name.label")} error={errors.name}>
        <Input
          autoFocus
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder={t("fields.name.placeholder")}
          maxLength={PROVIDER_LIMITS.name}
          className="h-9"
        />
      </FormField>

      <FormField label={t("fields.website.label")} optional error={errors.website}>
        <Input
          value={form.website}
          onChange={(e) => set("website")(e.target.value)}
          placeholder={t("fields.website.placeholder")}
          maxLength={PROVIDER_LIMITS.website}
          className="h-9"
        />
      </FormField>

      <FormField label={t("fields.phone.label")} optional error={errors.phone}>
        <Input
          value={form.phone}
          onChange={(e) => set("phone")(e.target.value)}
          placeholder={t("fields.phone.placeholder")}
          maxLength={PROVIDER_LIMITS.phone}
          className="h-9"
        />
      </FormField>

      <FormField label={t("fields.notes.label")} optional error={errors.notes}>
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder={t("fields.notes.placeholder")}
          maxLength={PROVIDER_LIMITS.notes}
          rows={3}
        />
      </FormField>

      {formError && <p className="text-destructive text-sm">{formError}</p>}
    </div>
  );
};
