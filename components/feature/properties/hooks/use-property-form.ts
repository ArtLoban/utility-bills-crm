"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { propertySchema } from "@/lib/validation/property";
import { createProperty, updateProperty } from "@/lib/actions/properties";
import type { TFormState } from "../types";
import { TPropertyDetail } from "@/app/(app)/properties/_data/mock";

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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setForm(makeInitialState(property));
        setErrors({});
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, property]);

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const isEditMode = property !== undefined;
  const canSave = form.name.trim() !== "" && form.type !== "";

  const handleSave = async () => {
    const result = propertySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const response = isEditMode
        ? await updateProperty(property.id, result.data)
        : await createProperty(result.data);

      if (!response.ok) {
        toast.error(response.error);
        return;
      }

      toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
      onOpenChange(false);
      if (!isEditMode) onCreated?.(response.data.id);
    } finally {
      setIsSaving(false);
    }
  };

  return { form, errors, set, handleSave, isSaving, canSave, isEditMode };
};
