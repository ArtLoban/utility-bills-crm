"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { PROFILE_LIMITS } from "@/features/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const ProfileSection = ({ name, email, image }: TProps) => {
  const t = useTranslations("settings.profile");
  const initials = (name ?? "?").charAt(0).toUpperCase();
  const { currentName, nameError, isSaving, dirty, handleNameChange, handleSave } = useProfileForm(
    name ?? "",
  );

  return (
    <SettingsCard>
      <SettingsCardHeader title={t("title")} description={t("description")} />
      <SettingsCardBody>
        {/* Avatar row */}
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

        {/* Name */}
        <div>
          <FieldLabel>{t("name.label")}</FieldLabel>
          <Input
            value={currentName}
            onChange={(e) => handleNameChange(e.target.value)}
            maxLength={PROFILE_LIMITS.name}
            className="h-9"
          />
          {nameError && <p className="text-destructive mt-[5px] text-xs">{nameError}</p>}
        </div>

        {/* Email */}
        <div>
          <FieldLabel>{t("email.label")}</FieldLabel>
          <Input value={email ?? ""} disabled className="h-9" />
          <FieldHint>{t("email.hint")}</FieldHint>
        </div>
      </SettingsCardBody>
      <SettingsCardFooter>
        <Button disabled={!dirty || isSaving} onClick={handleSave} className="h-9">
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          {t("saveButton")}
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};

export { ProfileSection };
