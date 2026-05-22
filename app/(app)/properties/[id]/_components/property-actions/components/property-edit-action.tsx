"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PropertyModal } from "@/features/properties";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = { property: TPropertyDetail };

export const PropertyEditAction = ({ property }: TProps) => {
  const [editOpen, setEditOpen] = useState(false);

  if (property.role !== "owner") return null;

  return (
    <>
      <Button variant="outline" onClick={() => setEditOpen(true)}>
        <Pencil size={13} />
        Edit
      </Button>
      <PropertyModal open={editOpen} onOpenChange={setEditOpen} property={property} />
    </>
  );
};
