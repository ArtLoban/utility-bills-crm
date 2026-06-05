"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveGlobalCms } from "@/features/landing-cms/actions";
import { globalSchema } from "@/features/landing-cms/schema";
import type { TGlobalPayload } from "@/features/landing-cms/types";

export const useGlobalForm = (initial: TGlobalPayload) => {
  const form = useForm<TGlobalPayload>({
    resolver: zodResolver(globalSchema),
    defaultValues: initial,
  });

  const { isDirty, isSubmitting } = form.formState;

  const handleSave = form.handleSubmit(async (data) => {
    const result = await saveGlobalCms(data);
    if (!result.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    form.reset(data);
    toast.success("Global settings saved.");
  });

  return { form, isDirty, isSaving: isSubmitting, handleSave };
};
