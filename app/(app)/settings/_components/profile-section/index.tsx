"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { PROFILE_LIMITS } from "@/features/profile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";
import { ReadOnlyField } from "@/components/read-only-field";

import {
  FieldHint,
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
                className="border-primary/20 size-16 shrink-0 rounded-full border-2"
              />
            ) : (
              <div className="border-primary/20 bg-primary/10 text-primary flex size-16 shrink-0 items-center justify-center rounded-full border-2 text-2xl font-semibold">
                {initials}
              </div>
            )}
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
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
            <ReadOnlyField label={t("email.label")}>{email ?? "—"}</ReadOnlyField>
            <FieldHint>{t("email.hint")}</FieldHint>
          </div>
        </SettingsCardBody>
        <SettingsCardFooter>
          <Button
            type="button"
            size="lg"
            disabled={!form.formState.isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            {t("saveButton")}
          </Button>
        </SettingsCardFooter>
      </Form>
    </SettingsCard>
  );
};
