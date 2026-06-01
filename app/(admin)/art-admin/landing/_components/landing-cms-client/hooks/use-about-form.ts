"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { saveAboutCms } from "@/features/landing-cms/actions";
import { aboutSchema } from "@/features/landing-cms/schema";
import type { TAboutPayload } from "@/features/landing-cms/types";

export const useAboutForm = (initial: TAboutPayload) => {
  const t = useTranslations();

  const form = useForm<TAboutPayload>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initial,
  });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveAboutCms(data);
    if (!result.ok) {
      toast.error(t(result.error.message as Parameters<typeof t>[0]));
      return;
    }
    form.reset(data);
    toast.success(t("landingCms.about.saveSuccess" as Parameters<typeof t>[0]));
  });

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
