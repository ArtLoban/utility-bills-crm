"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { propertySchema } from "@/lib/validation/property";
import { createProperty, editProperty } from "@/lib/actions/properties";
import type { TProperty } from "@/lib/db/schema/properties";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import type { TFormState } from "../types";

type TParams = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: TPropertyDetail;
  onCreated?: (id: string) => void;
};

const makeInitialState = (property?: TPropertyDetail): TFormState => ({
  name: property?.name ?? "",
  type: property?.type ?? "",
  address: property?.address ?? "",
  notes: property?.notes ?? "",
});

export const usePropertyForm = ({ open, onOpenChange, property, onCreated }: TParams) => {
  const t = useTranslations("properties");
  const [form, setForm] = useState<TFormState>(() => makeInitialState(property));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setForm(makeInitialState(property));
        setErrors({});
        setFormError(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, property]);

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
        // NotFoundError → guard failure (user lost access between open and save); toast + close.
        if (response.error.name === "ValidationError") {
          setFormError(t("modal.formError"));
        } else {
          toast.error(t("toast.saveError"));
          onOpenChange(false);
        }
        return;
      }

      toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
      onOpenChange(false);
      if (!isEditMode) onCreated?.((response.value as TProperty).id);
    } finally {
      setIsSaving(false);
    }
  };

  return { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode };
};
