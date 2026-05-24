"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createService } from "@/features/services/actions";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";

type TParams = {
  propertyId: PropertyId;
};

export const useAddService = ({ propertyId }: TParams) => {
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState<TServiceTypeId | null>(null);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const clearError = () => {
    if (formError) setFormError(null);
  };

  const selectType = (id: TServiceTypeId) => {
    setSelectedTypeId(id);
    clearError();
  };

  const canSave = selectedTypeId !== null;

  const handleSave = async () => {
    if (!selectedTypeId) return;

    setIsSaving(true);
    try {
      const result = await createService({
        propertyId,
        serviceTypeId: selectedTypeId,
        notes: notes.trim() || undefined,
      });

      if (!result.ok) {
        if (result.error.name === "ValidationError") {
          setFormError(result.error.message);
        } else {
          toast.error("Failed to add service. Please try again.");
          router.back();
        }
        return;
      }

      toast.success("Service added.");
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedTypeId,
    selectType,
    notes,
    setNotes: (v: string) => {
      setNotes(v);
      clearError();
    },
    formError,
    isSaving,
    canSave,
    handleSave,
  };
};
