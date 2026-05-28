"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createBill, editBill } from "@/features/bills/actions";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import { MONTH_OPTIONS } from "../constants";

type TUseBillFormProps = {
  bill?: TBillGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
  onClose: () => void;
};

type TFormState = {
  property: string;
  service: string;
  month: string;
  amount: string;
  notes: string;
};

const buildInitialState = (bill: TBillGlobalRow | undefined): TFormState => {
  if (bill) {
    return {
      property: bill.property.id,
      service: bill.bill.serviceId,
      month: bill.bill.periodMonth.substring(0, 7),
      amount: bill.bill.amount,
      notes: bill.bill.notes ?? "",
    };
  }
  return {
    property: "",
    service: "",
    month: MONTH_OPTIONS[0]?.value ?? "",
    amount: "",
    notes: "",
  };
};

export const useBillForm = ({ bill, serviceOptions = {}, onClose }: TUseBillFormProps) => {
  const isEditMode = Boolean(bill);
  const [form, setForm] = useState<TFormState>(() => buildInitialState(bill));
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (formError) setFormError(null);
  };

  const setProperty = (propertyId: string) => {
    setForm((f) => ({ ...f, property: propertyId, service: "" }));
    if (formError) setFormError(null);
  };

  const availableServices: TServiceOption[] = serviceOptions[form.property as PropertyId] ?? [];

  const selectedServiceCode =
    availableServices.find((s) => s.id === form.service)?.typeCode ?? form.service;

  const canSave = form.service !== "" && form.amount !== "" && form.month !== "";

  const handleSave = () => {
    if (!canSave) return;
    startTransition(async () => {
      if (isEditMode && bill) {
        const result = await editBill(bill.bill.id, {
          month: form.month,
          amount: Number(form.amount),
          notes: form.notes,
        });
        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            toast.error("Failed to save bill. Please try again.");
            onClose();
          }
          return;
        }
        toast.success("Bill updated.");
      } else {
        const result = await createBill({
          serviceId: form.service as TServiceId,
          month: form.month,
          amount: Number(form.amount),
          notes: form.notes,
        });
        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            toast.error("Failed to create bill. Please try again.");
            onClose();
          }
          return;
        }
        toast.success("Bill added.");
      }
      onClose();
    });
  };

  return {
    form,
    set,
    setProperty,
    availableServices,
    selectedServiceCode,
    canSave,
    isSaving,
    formError,
    handleSave,
    isEditMode,
  };
};
