"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { editService } from "@/features/services/actions";
import type { TServiceId } from "@/lib/db/schema/services";

type TParams = {
  serviceId: TServiceId;
  initialNotes: string | null;
};

export const useEditService = ({ serviceId, initialNotes }: TParams) => {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await editService(serviceId, { notes: notes.trim() || undefined });

      if (!result.ok) {
        if (result.error.name === "ValidationError") {
          setFormError(result.error.message);
        } else {
          toast.error("Failed to save notes. Please try again.");
          router.back();
        }
        return;
      }

      toast.success("Notes saved.");
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    notes,
    setNotes: (v: string) => {
      setNotes(v);
      if (formError) setFormError(null);
    },
    formError,
    isSaving,
    handleSave,
  };
};
