"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { changePaymentDetailsFormSchema } from "@/features/payment-details/schema";
import { changePaymentDetails } from "@/features/payment-details/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { todayIso } from "@/lib/format/date";
import type { TContractId } from "@/lib/db/schema/contracts";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { PaymentFormField } from "../types";

type TParams = {
  contractId: TContractId;
  onClose: () => void;
};

export const useChangePaymentForm = ({ contractId, onClose }: TParams) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useZodForm({
    schema: changePaymentDetailsFormSchema,
    namespace: UPDATE_CONTRACT_NAMESPACE,
    defaultValues: {
      [PaymentFormField.CHANGE_DATE]: todayIso(),
      [PaymentFormField.DETAILS]: "",
      [PaymentFormField.NOTES]: "",
    },
  });

  const submit = form.handleSubmit(async (data) => {
    const response = await changePaymentDetails({ ...data, contractId });

    if (!response.ok) {
      if (response.error.code === ERROR_CODES.VALIDATION) {
        const key = response.error.message as Parameters<typeof t>[0];
        form.setError("root", { message: t(key) });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t("toast.saved"));
    onClose();
  });

  return {
    form,
    submit,
    isSaving: form.formState.isSubmitting,
  };
};
