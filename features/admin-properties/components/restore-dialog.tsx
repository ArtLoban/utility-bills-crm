"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { errorMessage } from "@/lib/errors";

import { restoreProperty } from "../actions";
import { ADMIN_PROPERTY_ERROR_MESSAGES } from "../constants";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyName: string;
  onSuccess?: () => void;
};

export const RestoreDialog = ({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  onSuccess,
}: TProps) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await restoreProperty(propertyId);
      if (result.ok) {
        toast.success("Property restored successfully.");
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
      tone="warning"
      icon={<RotateCcw size={22} strokeWidth={1.75} />}
      title="Restore this property?"
      description={`${propertyName} will become active again. Users who had access will see it restored.`}
      confirmIcon={<RotateCcw size={15} strokeWidth={2} />}
      confirmLabel="Restore"
      cancelLabel="Cancel"
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
};
