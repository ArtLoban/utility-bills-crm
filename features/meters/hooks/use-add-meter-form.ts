"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { toDatetimeOffset } from "@/lib/format/date";
import type { TZoneCount } from "@/lib/constants/zones";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { createMeterFormSchema } from "../schema";
import { CreateMeterFormField } from "../types";
import type { TEligibleMeterService } from "../types";
import { buildCreateDefaultValues } from "../utils/build-create-default-values";
import { createMeter } from "../actions";

type TParams = {
  propertyId: string;
  availableServiceTypes: TServiceType[];
  eligibleServices: TEligibleMeterService[];
  onClose: () => void;
};

export const useAddMeterForm = ({
  propertyId,
  availableServiceTypes,
  eligibleServices,
  onClose,
}: TParams) => {
  const t = useTranslations("meters");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useZodForm({
    schema: createMeterFormSchema,
    namespace: "meters",
    defaultValues: buildCreateDefaultValues(),
    mode: "onTouched",
  });

  const serviceTypeId = form.watch(CreateMeterFormField.SERVICE_TYPE_ID);
  const selectedType = availableServiceTypes.find((st) => st.id === serviceTypeId) ?? null;
  const supportsZones = selectedType?.supportsZones ?? false;

  const servicesOfType = useMemo(
    () => eligibleServices.filter((s) => s.serviceTypeId === serviceTypeId),
    [eligibleServices, serviceTypeId],
  );

  useEffect(() => {
    if (!supportsZones) {
      form.setValue(CreateMeterFormField.ZONE_COUNT, "1");
    }
  }, [supportsZones, form]);

  // On type change, default the selection to every service of that type — reproducing the prior
  // by-type behavior (a meter fed all same-type services). The user can then narrow it.
  useEffect(() => {
    form.setValue(
      CreateMeterFormField.SERVICE_IDS,
      servicesOfType.map((s) => s.id),
    );
    // Depend on the type, not the derived list, so re-renders don't clobber the user's edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceTypeId]);

  const handleSave = form.handleSubmit(async (data) => {
    const result = await createMeter({
      propertyId,
      serviceTypeId: data.serviceTypeId,
      serviceIds: data.serviceIds,
      serialNumber: data.serialNumber || undefined,
      zoneCount: Number(data.zoneCount) as TZoneCount,
      installedAt: data.installedAt ? toDatetimeOffset(data.installedAt) : undefined,
      validFrom: toDatetimeOffset(data.validFrom),
      notes: data.notes || undefined,
    });

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        const key = result.error.message as Parameters<typeof t>[0];
        form.setError("root", { message: t(key) });
        return;
      }
      handleActionError(result.error);
      return;
    }

    toast.success(t("addForm.toast.success"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
    supportsZones,
    servicesOfType,
  };
};
