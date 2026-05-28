"use client";

import { Calendar, Info } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

import { FormField } from "@/components/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/routes";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TFormValues } from "../schema";

type TProps = {
  providers: TProvider[];
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export const ContractSection = ({ providers, control, errors }: TProps) => {
  const t = useTranslations("services.serviceForm");

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("fields.provider.label")} error={errors.providerId?.message}>
        {providers.length === 0 ? (
          <>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={t("noProviders.before")} />
              </SelectTrigger>
              <SelectContent />
            </Select>
            <div
              className="mt-2 flex items-start gap-2.5 rounded-md p-3"
              style={{
                background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
              }}
            >
              <Info size={15} className="text-primary mt-px shrink-0" />
              <p className="text-[12.5px] leading-relaxed">
                {t("noProviders.before")}{" "}
                <Link href={ROUTES.providers} className="text-primary font-medium underline">
                  {t("noProviders.link")}
                </Link>{" "}
                {t("noProviders.after")}
              </p>
            </div>
          </>
        ) : (
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
            )}
          />
        )}
      </FormField>

      <FormField
        label={t("fields.contractValidFrom.label")}
        error={errors.contractValidFrom?.message}
      >
        <div className="relative">
          <Controller
            name="contractValidFrom"
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                className="h-9 pl-9"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Calendar
            size={14}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          />
        </div>
      </FormField>

      <FormField label={t("fields.contractNotes.label")} optional>
        <Controller
          name="contractNotes"
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder={t("fields.contractNotes.placeholder")}
              rows={3}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>
    </div>
  );
};
