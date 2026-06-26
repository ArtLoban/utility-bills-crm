"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/routes";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import { UPDATE_MODES, type TUpdateMode } from "../types";
import { useChangeTariffForm } from "./use-change-tariff-form";
import { useChangeAccountForm } from "./use-change-account-form";
import { useChangePaymentForm } from "./use-change-payment-form";

type TParams = {
  contractId: TContractId;
  serviceId: TServiceId;
  propertyId: string;
  onClose: () => void;
};

export const useUpdateContract = ({ contractId, serviceId, propertyId, onClose }: TParams) => {
  const router = useRouter();
  const [selected, setSelected] = useState<TUpdateMode>(UPDATE_MODES.TARIFF);

  const tariff = useChangeTariffForm({ contractId, onClose });
  const account = useChangeAccountForm({ contractId, onClose });
  const payment = useChangePaymentForm({ contractId, onClose });

  const submitByMode: Record<TUpdateMode, (() => void) | null> = {
    [UPDATE_MODES.TARIFF]: tariff.submit,
    [UPDATE_MODES.ACCOUNT]: account.submit,
    [UPDATE_MODES.PAYMENT]: payment.submit,
    [UPDATE_MODES.PROVIDER]: null,
  };
  const savingByMode: Record<TUpdateMode, boolean> = {
    [UPDATE_MODES.TARIFF]: tariff.isSaving,
    [UPDATE_MODES.ACCOUNT]: account.isSaving,
    [UPDATE_MODES.PAYMENT]: payment.isSaving,
    [UPDATE_MODES.PROVIDER]: false,
  };

  const isProvider = selected === UPDATE_MODES.PROVIDER;

  const handleConfirm = () => {
    if (isProvider) {
      router.push(
        `${ROUTES.properties}/${propertyId}/services/${serviceId}/contract/change-provider`,
      );
      return;
    }
    submitByMode[selected]?.();
  };

  return {
    selected,
    setSelected,
    tariff,
    account,
    payment,
    isProvider,
    isSaving: savingByMode[selected],
    handleConfirm,
  };
};
