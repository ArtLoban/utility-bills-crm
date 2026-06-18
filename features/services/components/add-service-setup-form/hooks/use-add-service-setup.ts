"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { createServiceWithSetup } from "@/features/services/actions.composite";
import { createServiceWithSetupSchema } from "@/features/services/schema";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TCreateServiceWithSetupInput } from "@/features/services/schema";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TFormValues } from "../schema";

type TParams = {
  propertyId: PropertyId;
  serviceTypes: TServiceType[];
};

const buildActionInput = (
  values: TFormValues,
  propertyId: PropertyId,
  meterEngaged: boolean,
): TCreateServiceWithSetupInput => {
  const base: TCreateServiceWithSetupInput = {
    propertyId,
    serviceTypeId: values.serviceTypeId,
    serviceNotes: values.serviceNotes || undefined,
    providerId: values.providerId,
    contractValidFrom: values.contractValidFrom,
    contractNotes: values.contractNotes || undefined,
    tariffValidFrom: values.tariffValidFrom,
    rateT1: values.rateT1 || undefined,
    rateT2: values.rateT2 || undefined,
    rateT3: values.rateT3 || undefined,
    fixedAmount: values.fixedAmount || undefined,
    tariffNotes: values.tariffNotes || undefined,
  };

  if (!meterEngaged || !values.meter?.meterValidFrom) return base;

  return {
    ...base,
    meter: {
      serialNumber: values.meter.serialNumber || undefined,
      zoneCount: values.meter.zoneCount,
      installedAt: values.meter.installedAt
        ? new Date(values.meter.installedAt).toISOString()
        : undefined,
      meterValidFrom: new Date(values.meter.meterValidFrom).toISOString(),
      meterNotes: values.meter.meterNotes || undefined,
    },
  };
};

export const useAddServiceSetup = ({ propertyId, serviceTypes }: TParams) => {
  const t = useTranslations("services.serviceForm");
  const router = useRouter();
  const handleActionError = useActionErrorHandler({ onClose: () => router.back() });
  const [meterEngaged, setMeterEngaged] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<TFormValues>({
    defaultValues: {
      serviceTypeId: "",
      serviceNotes: "",
      providerId: "",
      contractValidFrom: "",
      contractNotes: "",
      tariffValidFrom: "",
      rateT1: "",
      rateT2: "",
      rateT3: "",
      fixedAmount: "",
      tariffNotes: "",
      meter: {
        serialNumber: "",
        zoneCount: 1,
        installedAt: "",
        meterValidFrom: "",
        meterNotes: "",
      },
    },
  });

  // react-hook-form's watch() returns a non-memoizable function; React Compiler
  // flags it as an incompatible library. Known RHF limitation, safe to ignore here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedTypeId = form.watch("serviceTypeId");
  const meterZoneCount = form.watch("meter.zoneCount");

  const selectedType = serviceTypes.find((st) => st.id === selectedTypeId) ?? null;
  const isMetered = selectedType?.measurementType === "metered";
  const effectiveZoneCount: 1 | 2 | 3 =
    isMetered && meterEngaged && meterZoneCount ? meterZoneCount : 1;
  const canSave = selectedType !== null;

  const resolveFormError = (message: string): string => {
    if (message.includes("already active")) return t("error.alreadyExists");
    if (message === "validation.overlap") return t("error.overlap");
    return t("error.generic");
  };

  const onSubmit = async () => {
    setFormError(null);
    const values = form.getValues();
    const input = buildActionInput(values, propertyId, meterEngaged);

    const parsed = createServiceWithSetupSchema.safeParse(input);
    if (!parsed.success) {
      form.clearErrors();
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as Parameters<typeof form.setError>[0];
        form.setError(path, { type: "manual", message: issue.message });
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await createServiceWithSetup(parsed.data);

      if (!result.ok) {
        if (result.error.code === ERROR_CODES.VALIDATION) {
          setFormError(resolveFormError(result.error.message));
        } else {
          handleActionError(result.error);
        }
        return;
      }

      toast.success(t("toast.created"));
      router.push(`/properties/${propertyId}/services/${result.value.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    meterEngaged,
    setMeterEngaged,
    formError,
    isSaving,
    canSave,
    selectedType,
    isMetered,
    effectiveZoneCount,
    onSubmit,
  };
};
