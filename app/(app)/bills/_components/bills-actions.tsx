"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddBillModal } from "./bills-client/add-bill-modal";

export const BillsActions = () => {
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
      <AddBillModal open={open} onOpenChange={setOpen} />
    </>
  );
};
