"use client";

import { useTranslations } from "next-intl";

import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTRACT_LIMITS } from "@/features/contracts/schema";
import type { TChangeProviderFormState } from "@/features/contracts/types";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";

type TProps = {
  form: TChangeProviderFormState;
  errors: Partial<Record<keyof TChangeProviderFormState, string>>;
  formError?: string | null;
  set: (key: keyof TChangeProviderFormState) => (value: string) => void;
  providers: TProvider[];
  currentProviderId: ProviderId;
};

export const ChangeProviderFormContent = ({
  form,
  errors,
  formError,
  set,
  providers,
  currentProviderId,
}: TProps) => {
  const t = useTranslations("contracts");

  // Exclude the current provider from the selection list — the user is switching away from it.
  const availableProviders = providers.filter((p) => p.id !== currentProviderId);

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("fields.provider.label")} error={errors.providerId}>
        <Select value={form.providerId} onValueChange={set("providerId")}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t("fields.provider.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {availableProviders.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label={t("fields.changeDate.label")} error={errors.changeDate}>
        <Input
          type="date"
          value={form.changeDate}
          onChange={(e) => set("changeDate")(e.target.value)}
          className="h-9"
        />
      </FormField>

      <FormField label={t("fields.notes.label")} optional error={errors.notes}>
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder={t("fields.notes.placeholder")}
          maxLength={CONTRACT_LIMITS.notes}
          rows={3}
        />
      </FormField>

      {formError && <p className="text-destructive text-sm">{formError}</p>}
    </div>
  );
};
