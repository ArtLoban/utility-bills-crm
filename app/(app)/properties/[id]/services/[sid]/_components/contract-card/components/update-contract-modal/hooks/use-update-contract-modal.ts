"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { TContractId } from "@/lib/db/schema/contracts";
import { errorMessage } from "@/lib/errors";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { changeTariff } from "@/features/tariffs/actions";
import { changeAccountNumber } from "@/features/account-numbers/actions";
import { changePaymentDetails } from "@/features/payment-details/actions";

export type TChangeOption = "tariff" | "account" | "payment" | "provider";

type TArgs = {
  contractId: TContractId;
  serviceId: TServiceId;
  serviceType: TServiceType;
  propertyId: string;
  onSuccess: () => void;
};

const useUpdateContractModal = ({
  contractId,
  serviceId,
  serviceType,
  propertyId,
  onSuccess,
}: TArgs) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<TChangeOption>("tariff");
  const [error, setError] = useState<string | null>(null);

  // Tariff form
  const [changeDate, setChangeDate] = useState("");
  const [rateT1, setRateT1] = useState("");
  const [rateT2, setRateT2] = useState("");
  const [rateT3, setRateT3] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");
  const [tariffNotes, setTariffNotes] = useState("");

  // Account number form
  const [accountValue, setAccountValue] = useState("");
  const [accountChangeDate, setAccountChangeDate] = useState("");
  const [accountNotes, setAccountNotes] = useState("");

  // Payment details form
  const [paymentDetailsText, setPaymentDetailsText] = useState("");
  const [paymentChangeDate, setPaymentChangeDate] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Accepts string for RadioOption compatibility; cast is safe — only valid TChangeOption values are passed.
  const handleSelect = (option: string) => {
    setSelected(option as TChangeOption);
    setError(null);
  };

  const handleSubmit = () => {
    if (selected === "provider") {
      router.push(`/properties/${propertyId}/services/${serviceId}/contract/change-provider`);
      onSuccess();
      return;
    }

    setError(null);
    startTransition(async () => {
      let result;

      if (selected === "tariff") {
        result = await changeTariff({
          contractId,
          changeDate,
          rateT1: rateT1 || undefined,
          rateT2: rateT2 || undefined,
          rateT3: rateT3 || undefined,
          fixedAmount: fixedAmount || undefined,
          notes: tariffNotes || undefined,
        });
      } else if (selected === "account") {
        result = await changeAccountNumber({
          contractId,
          value: accountValue,
          changeDate: accountChangeDate,
          notes: accountNotes || undefined,
        });
      } else {
        result = await changePaymentDetails({
          contractId,
          details: paymentDetailsText,
          changeDate: paymentChangeDate,
          notes: paymentNotes || undefined,
        });
      }

      if (!result.ok) {
        setError(errorMessage(result.error));
        return;
      }

      onSuccess();
    });
  };

  return {
    selected,
    handleSelect,
    isPending,
    error,
    handleSubmit,
    serviceType,
    // Tariff fields
    tariff: {
      changeDate,
      setChangeDate,
      rateT1,
      setRateT1,
      rateT2,
      setRateT2,
      rateT3,
      setRateT3,
      fixedAmount,
      setFixedAmount,
      notes: tariffNotes,
      setNotes: setTariffNotes,
    },
    // Account number fields
    account: {
      value: accountValue,
      setValue: setAccountValue,
      changeDate: accountChangeDate,
      setChangeDate: setAccountChangeDate,
      notes: accountNotes,
      setNotes: setAccountNotes,
    },
    // Payment details fields
    payment: {
      details: paymentDetailsText,
      setDetails: setPaymentDetailsText,
      changeDate: paymentChangeDate,
      setChangeDate: setPaymentChangeDate,
      notes: paymentNotes,
      setNotes: setPaymentNotes,
    },
  };
};

export { useUpdateContractModal };
