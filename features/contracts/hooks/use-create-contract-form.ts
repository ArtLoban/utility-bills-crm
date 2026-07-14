"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { createContractFormSchema } from "@/features/contracts/schema";
import { createContract } from "@/features/contracts/actions";
import { buildDefaultValues } from "@/features/contracts/utils/build-default-values";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
  onClose: () => void;
};

export const useCreateContractForm = ({ serviceId, onClose }: TParams) => {
  const t = useTranslations("contracts");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useLocalizedZodForm({
    schema: createContractFormSchema,
    namespace: "contracts",
    defaultValues: buildDefaultValues(),
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const response = await createContract({ ...data, serviceId });

    if (!response.ok) {
      if (response.error.code === ERROR_CODES.VALIDATION) {
        const key = response.error.message as Parameters<typeof t>[0];
        form.setError("root", { message: t(key) });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t("toast.added"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
