"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { PROPERTY_LIMITS } from "@/features/properties/schema";
import { PropertyTypeSelector } from "./components/property-type-selector";
import type { TFormState } from "@/features/properties/types";

type TProps = {
  form: TFormState;
  errors: Record<string, string>;
  formError?: string | null;
  set: (key: keyof TFormState) => (value: string) => void;
};

export const PropertyForm = ({ form, errors, formError, set }: TProps) => {
  const t = useTranslations("properties");

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("fields.name.label")} error={errors.name}>
        <Input
          autoFocus
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder={t("fields.name.placeholder")}
          maxLength={PROPERTY_LIMITS.name}
          style={
            form.name !== ""
              ? {
                  borderColor: "var(--field-tint-border)",
                  background: "var(--field-tint-bg)",
                  fontWeight: 500,
                }
              : undefined
          }
          className="h-9"
        />
      </FormField>

      <PropertyTypeSelector value={form.type} onChange={(value) => set("type")(value)} />

      <FormField label={t("fields.address.label")} optional error={errors.address}>
        <Input
          value={form.address}
          onChange={(e) => set("address")(e.target.value)}
          placeholder={t("fields.address.placeholder")}
          maxLength={PROPERTY_LIMITS.address}
          style={
            form.address !== ""
              ? {
                  borderColor: "var(--field-tint-border)",
                  background: "var(--field-tint-bg)",
                  fontWeight: 500,
                }
              : undefined
          }
          className="h-9"
        />
      </FormField>

      <FormField label={t("fields.notes.label")} optional error={errors.notes}>
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder={t("fields.notes.placeholder")}
          maxLength={PROPERTY_LIMITS.notes}
          rows={3}
        />
      </FormField>

      {formError && <p className="text-destructive text-sm">{formError}</p>}
    </div>
  );
};
