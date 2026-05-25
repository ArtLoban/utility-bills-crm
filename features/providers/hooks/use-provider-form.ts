"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { providerSchema } from "@/features/providers/schema";
import { createProvider, editProvider } from "@/features/providers/actions";
import type { TFormState } from "@/features/providers/types";
import type { TProvider } from "@/lib/db/schema/providers";

type TParams = {
  provider?: TProvider;
  onClose: () => void;
};

const makeInitialState = (provider?: TProvider): TFormState => ({
  name: provider?.name ?? "",
  website: provider?.website ?? "",
  phone: provider?.phone ?? "",
  notes: provider?.notes ?? "",
});

export const useProviderForm = ({ provider, onClose }: TParams) => {
  const t = useTranslations("providers");
  const [form, setForm] = useState<TFormState>(() => makeInitialState(provider));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
    if (formError) setFormError(null);
  };

  const isEditMode = provider !== undefined;
  const canSave = form.name.trim() !== "";

  const handleSave = async () => {
    const result = providerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        // providerSchema messages are relative keys within the "providers" namespace.
        // Translate here so ProviderForm renders plain strings, not i18n keys.
        if (!fieldErrors[field]) fieldErrors[field] = t(issue.message as Parameters<typeof t>[0]);
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const response = isEditMode
        ? await editProvider(provider.id, result.data)
        : await createProvider(result.data);

      if (!response.ok) {
        // ValidationError → inline per decision #105 (form validation never a toast).
        // NotFoundError → guard failure (provider deleted or access lost); toast + close.
        if (response.error.name === "ValidationError") {
          setFormError(t("modal.formError"));
        } else {
          toast.error(t("toast.saveError"));
          onClose();
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
