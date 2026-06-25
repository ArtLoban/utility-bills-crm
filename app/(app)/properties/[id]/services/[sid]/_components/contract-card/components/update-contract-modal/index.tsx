"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { ROUTES } from "@/lib/routes";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { UPDATE_CONTRACT_NAMESPACE } from "./constants";
import { UPDATE_MODES, type TUpdateMode } from "./types";
import { RadioOption } from "./components/radio-option";
import { TariffForm } from "./components/tariff-form";
import { AccountNumberForm } from "./components/account-number-form";
import { PaymentDetailsForm } from "./components/payment-details-form";
import { useChangeTariffForm } from "./hooks/use-change-tariff-form";
import { useChangeAccountForm } from "./hooks/use-change-account-form";
import { useChangePaymentForm } from "./hooks/use-change-payment-form";

type TActiveForm = {
  submit: () => void;
  isSaving: boolean;
};

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
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const router = useRouter();
  const [selected, setSelected] = useState<TUpdateMode>(UPDATE_MODES.TARIFF);

  const close = () => onOpenChange(false);
  const tariff = useChangeTariffForm({ contractId, onClose: close });
  const account = useChangeAccountForm({ contractId, onClose: close });
  const payment = useChangePaymentForm({ contractId, onClose: close });

  const formByMode: Record<TUpdateMode, TActiveForm | null> = {
    [UPDATE_MODES.TARIFF]: tariff,
    [UPDATE_MODES.ACCOUNT]: account,
    [UPDATE_MODES.PAYMENT]: payment,
    [UPDATE_MODES.PROVIDER]: null,
  };
  const activeForm = formByMode[selected];
  const isProvider = selected === UPDATE_MODES.PROVIDER;

  const handleConfirm = () => {
    if (isProvider) {
      router.push(
        `${ROUTES.properties}/${propertyId}/services/${serviceId}/contract/change-provider`,
      );
      close();
      return;
    }
    activeForm?.submit();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      description={t("prompt")}
      size="lg"
      onConfirm={handleConfirm}
      confirmLabel={isProvider ? t("goToProvider") : t("apply")}
      cancelLabel={t("cancel")}
      isSaving={activeForm?.isSaving ?? false}
    >
      <div className="flex flex-col gap-2">
        <RadioOption
          value={UPDATE_MODES.TARIFF}
          selected={selected}
          onSelect={setSelected}
          label={t("options.tariffLabel")}
          helper={t("options.tariffHelper")}
        >
          <TariffForm form={tariff.form} serviceType={serviceType} />
        </RadioOption>
        <RadioOption
          value={UPDATE_MODES.ACCOUNT}
          selected={selected}
          onSelect={setSelected}
          label={t("options.accountLabel")}
          helper={t("options.accountHelper")}
        >
          <AccountNumberForm form={account.form} />
        </RadioOption>
        <RadioOption
          value={UPDATE_MODES.PAYMENT}
          selected={selected}
          onSelect={setSelected}
          label={t("options.paymentLabel")}
          helper={t("options.paymentHelper")}
        >
          <PaymentDetailsForm form={payment.form} />
        </RadioOption>
        <RadioOption
          value={UPDATE_MODES.PROVIDER}
          selected={selected}
          onSelect={setSelected}
          label={t("options.providerLabel")}
          helper={t("options.providerHelper")}
        />
      </div>
    </Modal>
  );
};
