"use client";

import { toast } from "sonner";

import { saveHomeCms, homeSchema, type THomePayload } from "@/features/landing-cms";
import { useZodForm } from "@/lib/forms/use-zod-form";

export const useHomeForm = (initial: THomePayload) => {
  const form = useZodForm({ schema: homeSchema, defaultValues: initial });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveHomeCms(data);
    if (!result.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset(data);
    toast.success("Home content saved.");
  });

  return {
    form,
    isDirty,
    isSaving: isSubmitting,
    handleSave,
  };
};
