"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { providerSchema } from "@/features/providers/schema";
import { createProvider, editProvider } from "@/features/providers/actions";
import { buildDefaultValues } from "@/features/providers/utils/build-default-values";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TProvider } from "@/lib/db/schema/providers";

type TParams = {
  provider?: TProvider;
  onClose: () => void;
};

export const useProviderForm = ({ provider, onClose }: TParams) => {
  const t = useTranslations("providers");
  const handleActionError = useActionErrorHandler({ onClose });
  const isEditMode = provider !== undefined;

  const form = useLocalizedZodForm({
    schema: providerSchema,
    namespace: "providers",
    defaultValues: buildDefaultValues(provider),
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const response = isEditMode
      ? await editProvider(provider.id, data)
      : await createProvider(data);

    if (!response.ok) {
      if (response.error.code === ERROR_CODES.VALIDATION) {
        form.setError("root", { message: t("modal.formError") });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
    isEditMode,
  };
};
