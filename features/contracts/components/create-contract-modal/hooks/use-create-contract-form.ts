"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createContract } from "@/features/contracts/actions";
import { createContractSchema } from "@/features/contracts/schema";
import type { TCreateContractFormState } from "@/features/contracts/types";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useCreateContractForm = ({ serviceId }: TParams) => {
  const t = useTranslations("contracts");
  const router = useRouter();

  const [form, setForm] = useState<TCreateContractFormState>({
    providerId: "",
    validFrom: today(),
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TCreateContractFormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof TCreateContractFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const canSave = form.providerId !== "" && form.validFrom !== "";

  const handleSave = async () => {
    const result = createContractSchema.safeParse({ ...form, serviceId });
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TCreateContractFormState, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof TCreateContractFormState | undefined;
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
      const response = await createContract(result.data);

      if (!response.ok) {
        if (response.error.name === "ValidationError") {
          const key = response.error.message as Parameters<typeof t>[0];
          setFormError(t(key));
        } else {
          toast.error(t("toast.saveError"));
          router.back();
        }
        return;
      }

      toast.success(t("toast.added"));
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return { form, errors, formError, set, handleSave, isSaving, canSave };
};
