"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/bills";
import { AddBillModal } from "./bills-client/add-bill-modal";

type TProps = {
  propertyOptions: { id: PropertyId; name: string }[];
  serviceOptions: Record<PropertyId, TServiceOption[]>;
};

export const BillsActions = ({ propertyOptions, serviceOptions }: TProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Plus size={14} />
        Add Bill
      </Button>
      <AddBillModal
        open={open}
        onOpenChange={setOpen}
        propertyOptions={propertyOptions}
        serviceOptions={serviceOptions}
      />
    </>
  );
};
