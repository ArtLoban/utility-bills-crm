"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { PaymentFormContent } from "./payment-form-content";
import type { TPaymentRecord } from "../types";

type TProps = {
  payment?: TPaymentRecord;
};

export const PaymentModal = ({ payment }: TProps) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{payment ? "Edit Payment" : "Record Payment"}</DialogTitle>
        </DialogHeader>
        <PaymentFormContent payment={payment} />
      </DialogContent>
    </Dialog>
  );
};
