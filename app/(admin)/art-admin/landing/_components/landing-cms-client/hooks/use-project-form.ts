"use client";

import { toast } from "sonner";

import { saveProjectCms, projectSchema, type TProjectPayload } from "@/features/landing-cms";
import { useZodForm } from "@/lib/forms/use-zod-form";

export const useProjectForm = (initial: TProjectPayload) => {
  const form = useZodForm({ schema: projectSchema, defaultValues: initial });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveProjectCms(data);
    if (!result.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset(data);
    toast.success("Project content saved.");
  });

  return {
    form,
    isDirty,
    isSaving: isSubmitting,
    handleSave,
  };
};
