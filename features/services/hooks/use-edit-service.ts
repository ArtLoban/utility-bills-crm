"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { editServiceSchema } from "@/features/services/schema";
import { editService } from "@/features/services/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
  initialNotes: string | null;
  onClose: () => void;
};

export const useEditService = ({ serviceId, initialNotes, onClose }: TParams) => {
  const t = useTranslations("services.editNotes");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useZodForm({
    schema: editServiceSchema,
    namespace: "services.editNotes",
    defaultValues: { notes: initialNotes ?? "" },
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const result = await editService(serviceId, data);

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        form.setError("root", { message: t("formError") });
        return;
      }
      handleActionError(result.error);
      return;
    }

    toast.success(t("toast.saved"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
