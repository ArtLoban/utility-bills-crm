"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TChangeTariffForm } from "@/features/tariffs/schema";
import type { TChangeAccountNumberForm } from "@/features/account-numbers/schema";
import type { TChangePaymentDetailsForm } from "@/features/payment-details/schema";
import { UPDATE_CONTRACT_NAMESPACE } from "./constants";
import { UPDATE_MODES, type TUpdateMode } from "./types";
import { RadioOption } from "./components/radio-option";
import { TariffForm } from "./components/tariff-form";
import { AccountNumberForm } from "./components/account-number-form";
import { PaymentDetailsForm } from "./components/payment-details-form";

type TProps = {
  serviceType: TServiceType;
  selected: TUpdateMode;
  onSelect: (value: TUpdateMode) => void;
  tariffForm: UseFormReturn<TChangeTariffForm>;
  accountForm: UseFormReturn<TChangeAccountNumberForm>;
  paymentForm: UseFormReturn<TChangePaymentDetailsForm>;
};

export const UpdateContractFields = ({
  serviceType,
  selected,
  onSelect,
  tariffForm,
  accountForm,
  paymentForm,
}: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);

  return (
    <div className="flex flex-col gap-2">
      <RadioOption
        value={UPDATE_MODES.TARIFF}
        selected={selected}
        onSelect={onSelect}
        label={t("options.tariffLabel")}
        helper={t("options.tariffHelper")}
      >
        <TariffForm form={tariffForm} serviceType={serviceType} />
      </RadioOption>
      <RadioOption
        value={UPDATE_MODES.ACCOUNT}
        selected={selected}
        onSelect={onSelect}
        label={t("options.accountLabel")}
        helper={t("options.accountHelper")}
      >
        <AccountNumberForm form={accountForm} />
      </RadioOption>
      <RadioOption
        value={UPDATE_MODES.PAYMENT}
        selected={selected}
        onSelect={onSelect}
        label={t("options.paymentLabel")}
        helper={t("options.paymentHelper")}
      >
        <PaymentDetailsForm form={paymentForm} />
      </RadioOption>
      <RadioOption
        value={UPDATE_MODES.PROVIDER}
        selected={selected}
        onSelect={onSelect}
        label={t("options.providerLabel")}
        helper={t("options.providerHelper")}
      />
    </div>
  );
};
