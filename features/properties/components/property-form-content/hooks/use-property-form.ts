"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { propertySchema } from "@/features/properties/schema";
import { createProperty, editProperty } from "@/features/properties/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { buildDefaultValues } from "../utils/build-default-values";

type TParams = {
  property?: TPropertyDetail;
  onClose: () => void;
};

export const usePropertyForm = ({ property, onClose }: TParams) => {
  const t = useTranslations("properties");
  const handleActionError = useActionErrorHandler({ onClose });
  const isEditMode = property !== undefined;

  const form = useZodForm({
    schema: propertySchema,
    namespace: "properties",
    defaultValues: buildDefaultValues(property),
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const response = isEditMode
      ? await editProperty(property.id, data)
      : await createProperty(data);

    if (!response.ok) {
      // ValidationError → inline root error (form validation is never a toast, decision #105).
      // DemoModeError / NotFoundError → handled by the shared error handler.
      if (response.error.name === "ValidationError") {
        form.setError("root", { message: t("modal.formError") });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
    onClose();
  });

  return { form, handleSave, isSaving: form.formState.isSubmitting, isEditMode };
};
