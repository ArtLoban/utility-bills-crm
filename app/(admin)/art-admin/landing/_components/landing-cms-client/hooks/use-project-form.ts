"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveProjectCms } from "@/features/landing-cms/actions";
import { projectSchema } from "@/features/landing-cms/schema";
import type { TProjectPayload } from "@/features/landing-cms/types";

export const useProjectForm = (initial: TProjectPayload) => {
  const form = useForm<TProjectPayload>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial,
  });

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

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
