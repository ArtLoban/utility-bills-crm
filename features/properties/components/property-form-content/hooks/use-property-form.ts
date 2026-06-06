"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { propertySchema } from "@/features/properties/schema";
import { createProperty, editProperty } from "@/features/properties/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import type { TFormState } from "@/features/properties/types";

type TParams = {
  property?: TPropertyDetail;
  onClose: () => void;
};

const makeInitialState = (property?: TPropertyDetail): TFormState => ({
  name: property?.name ?? "",
  type: property?.type ?? "",
  address: property?.address ?? "",
  notes: property?.notes ?? "",
});

export const usePropertyForm = ({ property, onClose }: TParams) => {
  const t = useTranslations("properties");
  const handleActionError = useActionErrorHandler({ onClose });
  const [form, setForm] = useState<TFormState>(() => makeInitialState(property));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
    if (formError) setFormError(null);
  };

  const isEditMode = property !== undefined;
  const canSave = form.name.trim() !== "" && form.type !== "";

  const handleSave = async () => {
    const result = propertySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        // propertySchema messages are relative keys within the "properties" namespace.
        // Translate here so PropertyForm renders plain strings, not i18n keys.
        if (!fieldErrors[field]) fieldErrors[field] = t(issue.message as Parameters<typeof t>[0]);
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const response = isEditMode
        ? await editProperty(property.id, result.data)
        : await createProperty(result.data);

      if (!response.ok) {
        // ValidationError → inline per decision #105 (form validation never a toast).
        // DemoModeError / NotFoundError → handled by shared error handler.
        if (response.error.name === "ValidationError") {
          setFormError(t("modal.formError"));
        } else {
          handleActionError(response.error);
        }
        return;
      }

      toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode };
};
