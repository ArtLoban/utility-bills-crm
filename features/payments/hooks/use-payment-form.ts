"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getServiceLabel } from "@/lib/constants/service-colors";
import { getServiceBalanceAction } from "@/features/ledger/actions";
import type { TBalance } from "@/features/ledger/types";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/payments";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import { paymentSchema } from "../schema";
import type { TPaymentFormValues } from "../types";
import { recordPayment, editPayment } from "../actions";
import type { PaymentId } from "@/lib/db/schema/payments";

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const makeDefaultValues = (payment?: TPaymentGlobalRow): TPaymentFormValues => ({
  serviceId: payment?.payment.serviceId ?? "",
  paidAt: payment?.payment.paidAt ?? todayIso(),
  amount: payment?.payment.amount ? Number(payment.payment.amount) : (0 as number),
  notes: payment?.payment.notes ?? "",
});

type TParams = {
  payment?: TPaymentGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
  onClose: () => void;
};

export const usePaymentForm = ({ payment, propertyOptions, serviceOptions, onClose }: TParams) => {
  const isEditMode = payment !== undefined;

  const form = useForm<TPaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: makeDefaultValues(payment),
  });

  const initialPropertyId = payment?.property.id ?? "";
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(initialPropertyId);
  const [currentDebt, setCurrentDebt] = useState<TBalance | null>(null);

  const serviceId = useWatch({ control: form.control, name: "serviceId" });

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    getServiceBalanceAction(serviceId).then((result) => {
      if (!cancelled) setCurrentDebt(result);
    });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const filteredServices: Array<{ id: string; name: string }> = selectedPropertyId
    ? (serviceOptions?.[selectedPropertyId as PropertyId] ?? []).map((s) => ({
        id: s.id,
        name: getServiceLabel(s.typeCode),
      }))
    : [];

  const propertyList = propertyOptions ?? [];

  const onPropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    form.setValue("serviceId", "", { shouldDirty: true, shouldValidate: false });
    setCurrentDebt(null);
  };

  const handleSave = form.handleSubmit(async (data) => {
    if (isEditMode) {
      const result = await editPayment(payment.payment.id as PaymentId, {
        paidAt: data.paidAt,
        amount: data.amount,
        notes: data.notes,
      });
      if (!result.ok) {
        toast.error(result.error.message ?? "Failed to update payment.");
        return;
      }
      toast.success("Payment updated");
    } else {
      const result = await recordPayment({
        serviceId: data.serviceId,
        paidAt: data.paidAt,
        amount: data.amount,
        notes: data.notes,
      });
      if (!result.ok) {
        toast.error(result.error.message ?? "Failed to record payment.");
        return;
      }
      toast.success("Payment recorded");
    }
    onClose();
  });

  return {
    form,
    isSaving: form.formState.isSubmitting,
    properties: propertyList,
    filteredServices,
    selectedPropertyId,
    onPropertyChange,
    handleSave,
    isEditMode,
    currentDebt,
  };
};
