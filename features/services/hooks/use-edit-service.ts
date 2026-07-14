"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { editServiceSchema } from "@/features/services/schema";
import { editService } from "@/features/services/actions";
import { SERVICE_TYPE_CODES, type TServiceTypeCode } from "@/features/services/service-type";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
  initialName: string | null;
  initialNotes: string | null;
  serviceTypeCode: TServiceTypeCode;
  onClose: () => void;
};

export const useEditService = ({
  serviceId,
  initialName,
  initialNotes,
  serviceTypeCode,
  onClose,
}: TParams) => {
  const t = useTranslations("services.editService");
  const handleActionError = useActionErrorHandler({ onClose });
  const nameRequired = serviceTypeCode === SERVICE_TYPE_CODES.OTHER;

  const form = useLocalizedZodForm({
    schema: editServiceSchema,
    namespace: "services.editService",
    defaultValues: { name: initialName ?? "", notes: initialNotes ?? "" },
    mode: "onTouched",
  });

  const setNameRequiredError = () =>
    form.setError("name", { message: t("validation.name.requiredForOther") });

  const handleSave = form.handleSubmit(async (data) => {
    if (nameRequired && !data.name?.trim()) {
      setNameRequiredError();
      return;
    }

    const result = await editService(serviceId, data);

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        if (result.error.message === "validation.name.requiredForOther") {
          setNameRequiredError();
          return;
        }
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
    nameRequired,
  };
};
