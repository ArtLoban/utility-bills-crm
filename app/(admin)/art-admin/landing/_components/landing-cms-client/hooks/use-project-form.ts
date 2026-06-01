"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { saveProjectCms } from "@/features/landing-cms/actions";
import { projectSchema } from "@/features/landing-cms/schema";
import type { TProjectPayload } from "@/features/landing-cms/types";

export const useProjectForm = (initial: TProjectPayload) => {
  const t = useTranslations();

  const form = useForm<TProjectPayload>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial,
  });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveProjectCms(data);
    if (!result.ok) {
      toast.error(t(result.error.message as Parameters<typeof t>[0]));
      return;
    }
    form.reset(data);
    toast.success(t("landingCms.project.saveSuccess" as Parameters<typeof t>[0]));
  });

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
