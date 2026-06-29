"use client";

import { toast } from "sonner";

import { saveAboutCms } from "@/features/landing-cms/actions";
import { aboutSchema } from "@/features/landing-cms/schema";
import type { TAboutPayload } from "@/features/landing-cms/types";
import { useZodForm } from "@/lib/forms/use-zod-form";

export const useAboutForm = (initial: TAboutPayload) => {
  const form = useZodForm({ schema: aboutSchema, defaultValues: initial });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveAboutCms(data);
    if (!result.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset(data);
    toast.success("About content saved.");
  });

  return {
    form,
    isDirty,
    isSaving: isSubmitting,
    handleSave,
  };
};
