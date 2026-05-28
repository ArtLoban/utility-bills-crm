"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import { BillFormContent } from "./bill-form-content";

type TProps = {
  bill?: TBillGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
};

export const BillModal = ({ bill, propertyOptions, serviceOptions }: TProps) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[480px]"
      >
        {/* Header */}
        <div
          className="border-b border-zinc-200 dark:border-zinc-800"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {bill ? "Edit Bill" : "Add Bill"}
          </DialogTitle>
          <DialogClose
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        <BillFormContent
          bill={bill}
          propertyOptions={propertyOptions}
          serviceOptions={serviceOptions}
        />
      </DialogContent>
    </Dialog>
  );
};
