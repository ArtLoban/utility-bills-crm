"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

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
import type { TCreateContractFormState } from "@/features/contracts/types";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  form: TCreateContractFormState;
  errors: Partial<Record<keyof TCreateContractFormState, string>>;
  formError?: string | null;
  set: (key: keyof TCreateContractFormState) => (value: string) => void;
  providers: TProvider[];
};

export const CreateContractFormContent = ({ form, errors, formError, set, providers }: TProps) => {
  const t = useTranslations("contracts");

  if (providers.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("noProviders.message")}{" "}
        <Link href="/providers" className="text-violet-600 underline hover:no-underline">
          {t("noProviders.link")}
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("fields.provider.label")} error={errors.providerId}>
        <Select value={form.providerId} onValueChange={set("providerId")}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t("fields.provider.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label={t("fields.validFrom.label")} error={errors.validFrom}>
        <Input
          type="date"
          value={form.validFrom}
          onChange={(e) => set("validFrom")(e.target.value)}
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
