"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { saveHomeCms } from "@/features/landing-cms/actions";
import { homeSchema } from "@/features/landing-cms/schema";
import type { THomePayload } from "@/features/landing-cms/types";

export const useHomeForm = (initial: THomePayload) => {
  const t = useTranslations();

  const form = useForm<THomePayload>({
    resolver: zodResolver(homeSchema),
    defaultValues: initial,
  });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveHomeCms(data);
    if (!result.ok) {
      toast.error(t(result.error.message as Parameters<typeof t>[0]));
      return;
    }
    form.reset(data);
    toast.success(t("landingCms.home.saveSuccess" as Parameters<typeof t>[0]));
  });

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
