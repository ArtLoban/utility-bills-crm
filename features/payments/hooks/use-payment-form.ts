"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { paymentSchema } from "../schema";
import type { TPaymentFormValues, TPaymentRecord, TPropertyOption, TServiceOption } from "../types";

const MOCK_PROPERTIES: TPropertyOption[] = [
  { id: "p1", name: "Квартира Центр" },
  { id: "p2", name: "Дача" },
];

const MOCK_SERVICES: TServiceOption[] = [
  { id: "s1", name: "Electricity", propertyId: "p1" },
  { id: "s2", name: "Water", propertyId: "p1" },
  { id: "s3", name: "Gas", propertyId: "p2" },
];

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const makeDefaultValues = (payment?: TPaymentRecord): TPaymentFormValues => ({
  serviceId: payment?.serviceId ?? "",
  paidAt: payment?.paidAt ?? todayIso(),
  amount: payment?.amount ?? (0 as number),
  notes: payment?.notes ?? "",
});

type TParams = {
  payment?: TPaymentRecord;
  onClose: () => void;
};

export const usePaymentForm = ({ payment, onClose }: TParams) => {
  const isEditMode = payment !== undefined;

  const form = useForm<TPaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: makeDefaultValues(payment),
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  const filteredServices = selectedPropertyId
    ? MOCK_SERVICES.filter((s) => s.propertyId === selectedPropertyId)
    : [];

  const onPropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    form.setValue("serviceId", "", { shouldDirty: true, shouldValidate: false });
  };

  const handleSave = form.handleSubmit(async (data) => {
    // devnote: wire to server action when payments table exists
    await new Promise<void>((resolve) => setTimeout(resolve, 400));
    toast.success(isEditMode ? "Payment updated" : "Payment recorded");
    console.log("Payment submitted:", data);
    onClose();
  });

  return {
    form,
    isSaving: form.formState.isSubmitting,
    properties: MOCK_PROPERTIES,
    filteredServices,
    selectedPropertyId,
    onPropertyChange,
    handleSave,
    isEditMode,
  };
};
