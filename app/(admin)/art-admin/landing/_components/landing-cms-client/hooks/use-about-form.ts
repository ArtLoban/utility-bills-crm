"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveAboutCms } from "@/features/landing-cms/actions";
import { aboutSchema } from "@/features/landing-cms/schema";
import type { TAboutPayload } from "@/features/landing-cms/types";

export const useAboutForm = (initial: TAboutPayload) => {
  const form = useForm<TAboutPayload>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initial,
  });

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

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
