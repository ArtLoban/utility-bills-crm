"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import { getServiceBalanceAction } from "@/features/ledger/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { paymentFormSchema } from "@/features/payments/schema";
import { PaymentFormField } from "@/features/payments/types";
import { buildDefaultValues } from "@/features/payments/utils/build-default-values";
import { recordPayment, editPayment } from "@/features/payments/actions";
import type { TBalance } from "@/features/ledger/types";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { PaymentId } from "@/lib/db/schema/payments";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceOption } from "@/lib/db/access/payments";
import type { TPaymentGlobalRow } from "@/features/payments/types";

type TParams = {
  payment?: TPaymentGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
  onClose: () => void;
};

export const usePaymentForm = ({
  payment,
  propertyOptions = [],
  serviceOptions = {},
  onClose,
}: TParams) => {
  const t = useTranslations("payments");
  const tServiceTypes = useTranslations("services.types");
  const handleActionError = useActionErrorHandler({ onClose });
  const isEditMode = payment !== undefined;

  const form = useZodForm({
    schema: paymentFormSchema,
    namespace: "payments",
    defaultValues: buildDefaultValues(payment),
    mode: "onTouched",
  });

  const property = form.watch(PaymentFormField.PROPERTY);
  const serviceId = form.watch(PaymentFormField.SERVICE_ID);

  const availableServices = (serviceOptions[property as PropertyId] ?? []).map((service) => ({
    id: service.id,
    name: resolveServiceTypeLabel(service.typeCode, tServiceTypes),
  }));

  const [debt, setDebt] = useState<{ key: TServiceId; value: TBalance } | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    getServiceBalanceAction(serviceId as TServiceId).then((result) => {
      if (!cancelled && result)
        setDebt({
          key: serviceId as TServiceId,
          value: result,
        });
    });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const currentDebt = debt?.key === serviceId ? debt.value : null;

  const resetService = () => form.setValue(PaymentFormField.SERVICE_ID, "");

  const handleSave = form.handleSubmit(async (data) => {
    const response = isEditMode
      ? await editPayment(payment.payment.id as PaymentId, {
          paidAt: data.paidAt,
          amount: Number(data.amount),
          notes: data.notes,
        })
      : await recordPayment({
          serviceId: data.serviceId as TServiceId,
          paidAt: data.paidAt,
          amount: Number(data.amount),
          notes: data.notes,
        });

    if (!response.ok) {
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
    properties: propertyOptions,
    availableServices,
    currentDebt,
    resetService,
    lockedPropertyName: payment?.property.name,
    lockedServiceLabel: payment
      ? resolveServiceTypeLabel(payment.serviceTypeCode, tServiceTypes)
      : undefined,
  };
};
