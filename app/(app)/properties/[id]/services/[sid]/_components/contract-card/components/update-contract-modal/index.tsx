"use client";

import { X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { RadioOption } from "./components/radio-option";
import { TariffForm } from "./components/tariff-form";
import { AccountNumberForm } from "./components/account-number-form";
import { PaymentDetailsForm } from "./components/payment-details-form";
import { useUpdateContractModal } from "./hooks/use-update-contract-modal";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: TContractId;
  serviceId: TServiceId;
  serviceType: TServiceType;
  propertyId: string;
};

const UpdateContractModal = ({
  open,
  onOpenChange,
  contractId,
  serviceId,
  serviceType,
  propertyId,
}: TProps) => {
  const { selected, handleSelect, isPending, error, handleSubmit, tariff, account, payment } =
    useUpdateContractModal({
      contractId,
      serviceId,
      serviceType,
      propertyId,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] max-w-[520px] flex-col gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[520px]"
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800"
          style={{ padding: "16px 24px" }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            Update contract
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body — scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>
          <p
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 13.5, marginBottom: 16 }}
          >
            What&apos;s changing?
          </p>
          <div className="flex flex-col gap-2">
            <RadioOption
              value="tariff"
              selected={selected}
              onSelect={handleSelect}
              label="Tariff changed"
              helper="New rate or fixed amount applied"
            >
              <TariffForm fields={tariff} serviceType={serviceType} />
            </RadioOption>
            <RadioOption
              value="account"
              selected={selected}
              onSelect={handleSelect}
              label="Account number changed"
              helper="Provider assigned a new account ID"
            >
              <AccountNumberForm fields={account} />
            </RadioOption>
            <RadioOption
              value="payment"
              selected={selected}
              onSelect={handleSelect}
              label="Payment details changed"
              helper="New bank account or payment method"
            >
              <PaymentDetailsForm fields={payment} />
            </RadioOption>
            <RadioOption
              value="provider"
              selected={selected}
              onSelect={handleSelect}
              label="Provider changed"
              helper="Switched to a different energy supplier"
            />
          </div>

          {/* Error feedback */}
          {error && (
            <p className="text-destructive mt-3 text-sm" style={{ fontSize: 13 }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
          style={{ padding: "14px 24px", borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose
            className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 34 }}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="cursor-pointer rounded-md border-0 text-sm font-medium text-white disabled:opacity-60"
            style={{ height: 34, padding: "0 18px", background: ACCENT }}
          >
            {isPending
              ? "Saving…"
              : selected === "provider"
                ? "Go to change provider"
                : "Apply change"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { UpdateContractModal };
