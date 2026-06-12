"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { softDeleteService } from "@/features/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceName: string;
};

const DeleteServiceAction = ({ serviceId, propertyId, serviceName }: TProps) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await softDeleteService(serviceId);
      if (!result.ok) {
        toast.error("Failed to delete service. Please try again.");
        setConfirmOpen(false);
        return;
      }
      toast.success("Service deleted.");
      router.push(`/properties/${propertyId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            style={{ width: 30, height: 30 }}
          >
            <MoreHorizontal size={15} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} />
            Delete service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Modal
        title="Delete service"
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        variant="destructiveStrong"
        confirmIcon={Trash2}
        confirmLabel="Delete"
        isSaving={isDeleting}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="lg" border={true} />
          <p className="text-center text-sm">
            Delete <strong>{serviceName}</strong> from this property?
          </p>
          <p className="text-destructive text-center text-sm leading-snug font-semibold">
            All linked contracts, meters, readings, bills, and payments will also be removed.
          </p>
        </div>
      </Modal>
    </>
  );
};

export { DeleteServiceAction };
