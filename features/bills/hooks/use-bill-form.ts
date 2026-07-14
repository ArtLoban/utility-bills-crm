"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { billFormSchema } from "@/features/bills/schema";
import { BillFormField } from "@/features/bills/types";
import { createBill, editBill } from "@/features/bills/actions";
import { getExpectedAmountHintAction } from "@/features/ledger/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { buildDefaultValues } from "@/features/bills/utils/build-default-values";
import type { TExpectedAmount } from "@/features/ledger/types";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";

type TParams = {
  bill?: TBillGlobalRow;
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
  onClose: () => void;
};

export const useBillForm = ({ bill, serviceOptions = {}, onClose }: TParams) => {
  const t = useTranslations("bills");
  const handleActionError = useActionErrorHandler({ onClose });
  const isEditMode = bill !== undefined;

  const form = useLocalizedZodForm({
    schema: billFormSchema,
    namespace: "bills",
    defaultValues: buildDefaultValues(bill),
    mode: "onTouched",
  });

  const property = form.watch(BillFormField.PROPERTY);
  const serviceId = form.watch(BillFormField.SERVICE_ID);
  const month = form.watch(BillFormField.MONTH);

  const availableServices = serviceOptions[property as PropertyId] ?? [];

  // The hint is driven by service + month. It is keyed by that pair so a stale
  // result (or an incomplete selection after a property reset) is ignored at
  // render via a key mismatch — no synchronous clearing inside the effect.
  const hintKey = serviceId && month ? `${serviceId}|${month}` : null;
  const [hint, setHint] = useState<{ key: string; value: TExpectedAmount } | null>(null);

  useEffect(() => {
    if (!hintKey) return;
    let cancelled = false;
    getExpectedAmountHintAction(serviceId as TServiceId, month).then((result) => {
      if (!cancelled && result) setHint({ key: hintKey, value: result });
    });
    return () => {
      cancelled = true;
    };
  }, [hintKey, serviceId, month]);

  const expectedAmount = hint?.key === hintKey ? hint.value : null;

  const resetService = () => form.setValue(BillFormField.SERVICE_ID, "");

  const handleSave = form.handleSubmit(async (data) => {
    const response = isEditMode
      ? await editBill(bill.bill.id, {
          month: data.month,
          amount: Number(data.amount),
          notes: data.notes,
        })
      : await createBill({
          serviceId: data.serviceId as TServiceId,
          month: data.month,
          amount: Number(data.amount),
          notes: data.notes,
        });

    if (!response.ok) {
      // ValidationError → inline root error (form validation is never a toast, decision #105).
      // DemoModeError / NotFoundError → handled by the shared error handler.
      if (response.error.code === ERROR_CODES.VALIDATION) {
        form.setError("root", { message: t("modal.formError") });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
    isEditMode,
    availableServices,
    expectedAmount,
    resetService,
    lockedPropertyName: bill?.property.name,
    lockedServiceCode: bill?.serviceTypeCode,
  };
};
