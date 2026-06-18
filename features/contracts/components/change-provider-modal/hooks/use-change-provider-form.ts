"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { changeProvider } from "@/features/contracts/actions";
import { changeProviderSchema } from "@/features/contracts/schema";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TChangeProviderFormState } from "@/features/contracts/types";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useChangeProviderForm = ({ serviceId }: TParams) => {
  const t = useTranslations("contracts");
  const router = useRouter();
  const handleActionError = useActionErrorHandler({ onClose: () => router.back() });

  const [form, setForm] = useState<TChangeProviderFormState>({
    providerId: "",
    changeDate: today(),
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TChangeProviderFormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof TChangeProviderFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const canSave = form.providerId !== "" && form.changeDate !== "";

  const handleSave = async () => {
    const result = changeProviderSchema.safeParse({
      serviceId,
      newProviderId: form.providerId,
      changeDate: form.changeDate,
      notes: form.notes,
    });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TChangeProviderFormState, string>> = {};
      result.error.issues.forEach((issue) => {
        const rawKey = issue.path[0];
        // Map action schema keys (newProviderId, changeDate) back to form state keys
        const fieldMap: Record<string, keyof TChangeProviderFormState> = {
          newProviderId: "providerId",
          changeDate: "changeDate",
          notes: "notes",
        };
        const field = rawKey ? fieldMap[rawKey as string] : undefined;
        if (field && !fieldErrors[field]) {
          const key = issue.message as Parameters<typeof t>[0];
          fieldErrors[field] = t(key);
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const response = await changeProvider(result.data);

      if (!response.ok) {
        if (response.error.code === ERROR_CODES.VALIDATION) {
          const key = response.error.message as Parameters<typeof t>[0];
          setFormError(t(key));
        } else {
          handleActionError(response.error);
        }
        return;
      }

      toast.success(t("toast.providerChanged"));
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return { form, errors, formError, set, handleSave, isSaving, canSave };
};
