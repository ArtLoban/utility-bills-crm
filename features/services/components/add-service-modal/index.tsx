"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";
import { AddServiceFormContent } from "./add-service-form-content";

type TProps = {
  propertyId: PropertyId;
  serviceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
};

export const AddServiceModal = ({ propertyId, serviceTypes, existingTypeIds }: TProps) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add service</DialogTitle>
        </DialogHeader>
        <AddServiceFormContent
          propertyId={propertyId}
          serviceTypes={serviceTypes}
          existingTypeIds={existingTypeIds}
        />
      </DialogContent>
    </Dialog>
  );
};
