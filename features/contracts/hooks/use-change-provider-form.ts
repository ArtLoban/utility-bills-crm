"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { changeProviderFormSchema } from "@/features/contracts/schema";
import { changeProvider } from "@/features/contracts/actions";
import { ChangeProviderFormField } from "@/features/contracts/types";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { todayIso } from "@/lib/format/date";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
  onClose: () => void;
};

export const useChangeProviderForm = ({ serviceId, onClose }: TParams) => {
  const t = useTranslations("contracts");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useLocalizedZodForm({
    schema: changeProviderFormSchema,
    namespace: "contracts",
    defaultValues: {
      [ChangeProviderFormField.NEW_PROVIDER_ID]: "",
      [ChangeProviderFormField.CHANGE_DATE]: todayIso(),
      [ChangeProviderFormField.NOTES]: "",
    },
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const response = await changeProvider({ ...data, serviceId });

    if (!response.ok) {
      if (response.error.code === ERROR_CODES.VALIDATION) {
        const key = response.error.message as Parameters<typeof t>[0];
        form.setError("root", { message: t(key) });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t("toast.providerChanged"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
