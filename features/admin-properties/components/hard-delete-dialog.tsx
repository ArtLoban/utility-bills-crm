"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { errorMessage } from "@/lib/errors";

import { hardDeleteProperty } from "../actions";
import { ADMIN_PROPERTY_ERROR_MESSAGES } from "../constants";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyName: string;
  onSuccess?: () => void;
};

export const HardDeleteDialog = ({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  onSuccess,
}: TProps) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await hardDeleteProperty(propertyId);
      if (result.ok) {
        toast.success("Property permanently deleted.");
        onOpenChange(false);
        onSuccess?.();
      } else {
        const code = errorMessage(result.error) ?? "generic";
        toast.error(ADMIN_PROPERTY_ERROR_MESSAGES[code] ?? ADMIN_PROPERTY_ERROR_MESSAGES.generic);
      }
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="destructive"
      icon={Trash2}
      title="Delete this property permanently?"
      description={`${propertyName} and all its data will be permanently erased. This cannot be undone.`}
      warningText="This action is irreversible."
      requireType="DELETE"
      confirmLabel="Delete permanently"
      cancelLabel="Cancel"
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
};
