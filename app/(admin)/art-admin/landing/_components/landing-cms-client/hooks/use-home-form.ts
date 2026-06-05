"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveHomeCms } from "@/features/landing-cms/actions";
import { homeSchema } from "@/features/landing-cms/schema";
import type { THomePayload } from "@/features/landing-cms/types";

export const useHomeForm = (initial: THomePayload) => {
  const form = useForm<THomePayload>({
    resolver: zodResolver(homeSchema),
    defaultValues: initial,
  });

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

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
