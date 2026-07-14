"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useLocalizedZodForm } from "@/lib/forms/use-localized-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { toDatetimeOffset } from "@/lib/format/date";
import type { TZoneCount } from "@/lib/constants/zones";
import type { TMeter } from "@/lib/db/schema/meters";

import { replaceMeterFormSchema } from "../schema";
import { buildReplaceDefaultValues } from "../utils/build-replace-default-values";
import { replaceMeter } from "../actions";

type TParams = {
  meter: TMeter;
  onClose: () => void;
};

export const useReplaceMeterForm = ({ meter, onClose }: TParams) => {
  const t = useTranslations("meters");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useLocalizedZodForm({
    schema: replaceMeterFormSchema,
    namespace: "meters",
    defaultValues: buildReplaceDefaultValues(meter),
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const result = await replaceMeter({
      currentMeterId: meter.id,
      replacementDate: toDatetimeOffset(data.replacementDate),
      serialNumber: data.serialNumber || undefined,
      zoneCount: Number(data.zoneCount) as TZoneCount,
      installedAt: data.installedAt ? toDatetimeOffset(data.installedAt) : undefined,
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

    toast.success(t("replaceForm.toast.success"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
