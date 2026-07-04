"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { createServiceWithSetup } from "@/features/services/actions.composite";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { SERVICE_TYPE_CODES } from "@/features/services/service-type";
import { ServiceMeterField, ServiceSetupFormField, serviceSetupFormSchema } from "../schema";
import { buildDefaultValues } from "../utils/build-default-values";
import { buildActionInput } from "../utils/build-action-input";

type TParams = {
  propertyId: PropertyId;
  serviceTypes: TServiceType[];
};

export const useAddServiceSetup = ({ propertyId, serviceTypes }: TParams) => {
  const t = useTranslations("services.serviceForm");
  const router = useRouter();
  const handleActionError = useActionErrorHandler({ onClose: () => router.back() });

  const form = useZodForm({
    schema: serviceSetupFormSchema,
    namespace: "services.serviceForm",
    defaultValues: buildDefaultValues(),
    mode: "onTouched",
  });

  const selectedTypeId = form.watch(ServiceSetupFormField.SERVICE_TYPE_ID);
  const meterEngaged = form.watch(ServiceSetupFormField.METER_ENGAGED);
  const meterZoneCount = form.watch(ServiceMeterField.ZONE_COUNT);

  const selectedType = serviceTypes.find((st) => st.id === selectedTypeId) ?? null;
  const isMetered = selectedType?.measurementType === "metered";
  const effectiveZoneCount: 1 | 2 | 3 =
    isMetered && meterEngaged && meterZoneCount ? meterZoneCount : 1;
  const canSave = selectedType !== null;

  const setMeterEngaged = (engaged: boolean) =>
    form.setValue(ServiceSetupFormField.METER_ENGAGED, engaged, { shouldValidate: true });

  useEffect(() => {
    if (!isMetered && meterEngaged) {
      form.setValue(ServiceSetupFormField.METER_ENGAGED, false);
    }
  }, [isMetered, meterEngaged, form]);

  const resolveFormError = (message: string): string => {
    if (message.includes("already active")) return t("error.alreadyExists");
    if (message === "validation.overlap") return t("error.overlap");

    return t("error.generic");
  };

  const setNameRequiredError = () =>
    form.setError(ServiceSetupFormField.NAME, {
      message: t("validation.name.requiredForOther"),
    });

  const onSubmit = form.handleSubmit(async (values) => {
    if (selectedType?.code === SERVICE_TYPE_CODES.OTHER && !values.name.trim()) {
      setNameRequiredError();
      return;
    }

    const result = await createServiceWithSetup(buildActionInput(values, propertyId));

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        if (result.error.message === "validation.name.requiredForOther") {
          setNameRequiredError();
          return;
        }
        form.setError("root", { message: resolveFormError(result.error.message) });
        return;
      }
      handleActionError(result.error);
      return;
    }

    toast.success(t("toast.created"));
    router.push(`${ROUTES.properties}/${propertyId}/services/${result.value.id}`);
  });

  return {
    form,
    meterEngaged,
    setMeterEngaged,
    isSaving: form.formState.isSubmitting,
    canSave,
    selectedType,
    isMetered,
    effectiveZoneCount,
    onSubmit,
  };
};
