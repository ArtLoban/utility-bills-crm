"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { TServiceId } from "@/lib/db/schema/services";
import { EditServiceFormContent } from "./edit-service-form-content";

type TProps = {
  serviceId: TServiceId;
  initialNotes: string | null;
};

export const EditServiceModal = ({ serviceId, initialNotes }: TProps) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit notes</DialogTitle>
        </DialogHeader>
        <EditServiceFormContent serviceId={serviceId} initialNotes={initialNotes} />
      </DialogContent>
    </Dialog>
  );
};
