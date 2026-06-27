"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { formatDisplayDate, toDatetimeOffset } from "@/lib/format/date";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";

import { buildReadingFormSchema } from "../schema";
import { ReadingFormField, type TZoneField, type TZoneState } from "../types";
import { buildDefaultValues } from "../utils/build-default-values";
import { parseReadingValue } from "../utils/parse-value";
import { deriveZoneState, toLastValue } from "../utils/zone-state";
import { createReading, updateReading } from "../actions";

type TParams = {
  meter: TMeter;
  reading?: TReading;
  lastReading: TReading | null;
  onClose: () => void;
};

export const useReadingForm = ({ meter, reading, lastReading, onClose }: TParams) => {
  const t = useTranslations("readings");
  const handleActionError = useActionErrorHandler({ onClose });
  const isEdit = reading !== undefined;
  const { zoneCount } = meter;

  const schema = useMemo(() => buildReadingFormSchema(zoneCount), [zoneCount]);

  const form = useZodForm({
    schema,
    namespace: "readings",
    defaultValues: buildDefaultValues(reading),
    mode: "onTouched",
  });

  const values = useWatch({ control: form.control });

  const zoneStates: Record<TZoneField, TZoneState> = {
    [ReadingFormField.VALUE_T1]: deriveZoneState(
      values.valueT1 ?? "",
      toLastValue(lastReading?.valueT1 ?? null),
    ),
    [ReadingFormField.VALUE_T2]: deriveZoneState(
      values.valueT2 ?? "",
      toLastValue(lastReading?.valueT2 ?? null),
    ),
    [ReadingFormField.VALUE_T3]: deriveZoneState(
      values.valueT3 ?? "",
      toLastValue(lastReading?.valueT3 ?? null),
    ),
  };

  const hasAnyWarning = Object.values(zoneStates).some((z) => z.warning);
  const lastReadingDate = lastReading ? formatDisplayDate(lastReading.readAt) : null;

  const handleSave = form.handleSubmit(async (data) => {
    const input = {
      readAt: toDatetimeOffset(data.readAt),
      valueT1: parseReadingValue(data.valueT1) ?? 0,
      valueT2: zoneCount >= 2 ? parseReadingValue(data.valueT2) : undefined,
      valueT3: zoneCount === 3 ? parseReadingValue(data.valueT3) : undefined,
      notes: data.notes,
    };

    const result = isEdit
      ? await updateReading(reading.id, input)
      : await createReading({ meterId: meter.id, ...input });

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        const key = result.error.message as Parameters<typeof t>[0];
        form.setError("root", { message: t(key) });
        return;
      }
      handleActionError(result.error);
      return;
    }

    toast.success(t(isEdit ? "toast.updated" : "toast.created"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
    isEdit,
    hasAnyWarning,
    zoneStates,
    lastReadingDate,
  };
};
