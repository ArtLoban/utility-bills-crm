"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateProfileName, profileNameSchema } from "@/features/profile";
import { errorMessage } from "@/lib/errors";

export const useProfileForm = (initialName: string) => {
  const t = useTranslations("settings.profile");
  const router = useRouter();

  const [currentName, setCurrentName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const dirty = currentName !== savedName;

  const handleNameChange = (value: string) => {
    setCurrentName(value);
    if (nameError) setNameError(null);
  };

  const handleSave = async () => {
    const result = profileNameSchema.safeParse({ name: currentName });
    if (!result.success) {
      setNameError(t(result.error.issues[0]!.message as Parameters<typeof t>[0]));
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProfileName({ name: currentName });

      if (!response.ok) {
        const key = errorMessage(response.error);
        setNameError(key ? t(key as Parameters<typeof t>[0]) : null);
        return;
      }

      setSavedName(currentName);
      toast.success(t("toast.saved"));
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return { currentName, nameError, isSaving, dirty, handleNameChange, handleSave };
};
