"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { saveGlobalCms } from "@/features/landing-cms/actions";
import { globalSchema } from "@/features/landing-cms/schema";
import type { TGlobalPayload } from "@/features/landing-cms/types";

export const useGlobalForm = (initial: TGlobalPayload) => {
  const t = useTranslations();

  const form = useForm<TGlobalPayload>({
    resolver: zodResolver(globalSchema),
    defaultValues: initial,
  });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveGlobalCms(data);
    if (!result.ok) {
      toast.error(t(result.error.message as Parameters<typeof t>[0]));
      return;
    }
    form.reset(data);
    toast.success(t("landingCms.global.saveSuccess" as Parameters<typeof t>[0]));
  });

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
