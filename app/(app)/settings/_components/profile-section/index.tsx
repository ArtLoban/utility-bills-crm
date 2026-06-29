"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { PROFILE_LIMITS } from "@/features/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";

import {
  FieldHint,
  FieldLabel,
  SettingsCard,
  SettingsCardBody,
  SettingsCardFooter,
  SettingsCardHeader,
} from "../settings-card";
import { useProfileForm } from "./hooks/use-profile-form";

type TProps = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export const ProfileSection = ({ name, email, image }: TProps) => {
  const t = useTranslations("settings.profile");
  const initials = (name ?? "?").charAt(0).toUpperCase();
  const { form, handleSave, isSaving } = useProfileForm(name ?? "");

  return (
    <SettingsCard>
      <SettingsCardHeader title={t("title")} description={t("description")} />
      <Form {...form}>
        <SettingsCardBody>
          <div className="flex items-center gap-4">
            {image ? (
              <Image
                src={image}
                alt={name ?? "Avatar"}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-full border-2 border-violet-200 dark:border-violet-800"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-violet-100 text-2xl font-semibold text-violet-600 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
                {initials}
              </div>
            )}
            <p className="max-w-[340px] text-sm leading-[1.6] text-zinc-500 dark:text-zinc-400">
              {t("avatarHint")}
            </p>
          </div>

          <FormTextField
            control={form.control}
            name="name"
            label={t("name.label")}
            maxLength={PROFILE_LIMITS.name}
            inputClassName="h-9"
          />

          <div>
            <FieldLabel>{t("email.label")}</FieldLabel>
            <Input value={email ?? ""} disabled className="h-9" />
            <FieldHint>{t("email.hint")}</FieldHint>
          </div>
        </SettingsCardBody>
        <SettingsCardFooter>
          <Button
            type="button"
            disabled={!form.formState.isDirty || isSaving}
            onClick={handleSave}
            className="h-9"
          >
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            {t("saveButton")}
          </Button>
        </SettingsCardFooter>
      </Form>
    </SettingsCard>
  );
};
