"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { restoreProperty } from "@/features/admin-properties/actions";
import { errorMessage } from "@/lib/errors";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";

const ADMIN_PROPERTY_ERRORS: Record<string, string> = {
  NOT_DELETED: "This property is not deleted — nothing to restore.",
  NOT_SOFT_DELETED: "Hard delete requires the property to be soft-deleted first.",
  generic: "Something went wrong. Please try again.",
};

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
        toast.error(ADMIN_PROPERTY_ERRORS[code] ?? ADMIN_PROPERTY_ERRORS.generic);
      }
    });
  };

  return (
    <Modal
      title="Restore this property?"
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      variant="warning"
      confirmIcon={RotateCcw}
      confirmLabel="Restore"
      isSaving={isPending}
    >
      <div className="my-3 flex flex-col items-center gap-4">
        <IconBadge icon={RotateCcw} color="var(--warning)" size="lg" border={true} />
        <p className="text-center text-sm">
          <strong>{propertyName}</strong> will become active again. Users who had access will see it
          restored.
        </p>
      </div>
    </Modal>
  );
};
