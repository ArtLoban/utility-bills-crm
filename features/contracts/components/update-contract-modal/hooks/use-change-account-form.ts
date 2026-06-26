"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { changeAccountNumberFormSchema } from "@/features/account-numbers/schema";
import { changeAccountNumber } from "@/features/account-numbers/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { todayIso } from "@/lib/format/date";
import type { TContractId } from "@/lib/db/schema/contracts";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { AccountFormField } from "../types";

type TParams = {
  contractId: TContractId;
  onClose: () => void;
};

export const useChangeAccountForm = ({ contractId, onClose }: TParams) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useZodForm({
    schema: changeAccountNumberFormSchema,
    namespace: UPDATE_CONTRACT_NAMESPACE,
    defaultValues: {
      [AccountFormField.CHANGE_DATE]: todayIso(),
      [AccountFormField.VALUE]: "",
      [AccountFormField.NOTES]: "",
    },
  });

  const submit = form.handleSubmit(async (data) => {
    const response = await changeAccountNumber({ ...data, contractId });

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
