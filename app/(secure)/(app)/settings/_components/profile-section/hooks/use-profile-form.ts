"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { profileNameSchema, updateProfileName } from "@/features/profile";
import { useZodForm } from "@/lib/forms/use-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";

export const useProfileForm = (initialName: string) => {
  const t = useTranslations("settings.profile");
  const router = useRouter();
  const handleActionError = useActionErrorHandler({});

  const form = useZodForm({
    schema: profileNameSchema,
    namespace: "settings.profile",
    defaultValues: { name: initialName },
  });

  const handleSave = form.handleSubmit(async (data) => {
    const response = await updateProfileName(data);
    if (!response.ok) {
      handleActionError(response.error);
      return;
    }

    form.reset(data);
    toast.success(t("toast.saved"));
    router.refresh();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
