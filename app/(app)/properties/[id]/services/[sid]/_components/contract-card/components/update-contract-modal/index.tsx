"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
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

export const UpdateContractModal = ({
  open,
  onOpenChange,
  contractId,
  serviceId,
  serviceType,
  propertyId,
}: TProps) => {
  const t = useTranslations("services.detail.updateContract");
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
        <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-md font-semibold tracking-[-0.2px]">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label={t("cancel")}>
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <p className="text-muted-foreground mb-4 text-sm">{t("prompt")}</p>
          <div className="flex flex-col gap-2">
            <RadioOption
              value="tariff"
              selected={selected}
              onSelect={handleSelect}
              label={t("options.tariffLabel")}
              helper={t("options.tariffHelper")}
            >
              <TariffForm fields={tariff} serviceType={serviceType} />
            </RadioOption>
            <RadioOption
              value="account"
              selected={selected}
              onSelect={handleSelect}
              label={t("options.accountLabel")}
              helper={t("options.accountHelper")}
            >
              <AccountNumberForm fields={account} />
            </RadioOption>
            <RadioOption
              value="payment"
              selected={selected}
              onSelect={handleSelect}
              label={t("options.paymentLabel")}
              helper={t("options.paymentHelper")}
            >
              <PaymentDetailsForm fields={payment} />
            </RadioOption>
            <RadioOption
              value="provider"
              selected={selected}
              onSelect={handleSelect}
              label={t("options.providerLabel")}
              helper={t("options.providerHelper")}
            />
          </div>

          {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
        </div>

        <div className="border-border bg-muted/40 flex shrink-0 items-center justify-between rounded-b-[10px] border-t px-6 py-3.5">
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? t("saving") : selected === "provider" ? t("goToProvider") : t("apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
