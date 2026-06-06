"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import { createReading, updateReading } from "@/features/readings/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";

type TFormState = {
  readAt: string;
  valueT1: string;
  valueT2: string;
  valueT3: string;
  notes: string;
};

type TWarningFlags = {
  t1: boolean;
  t2: boolean;
  t3: boolean;
};

type TParams = {
  meter: TMeter;
  reading?: TReading;
  lastReading: TReading | null;
  onClose: () => void;
};

const todayIso = (): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const toDatetimeOffset = (dateStr: string): string => {
  // Convert YYYY-MM-DD to an ISO 8601 datetime with timezone offset.
  // We use local midnight to preserve the user's intent.
  const d = new Date(dateStr + "T00:00:00");
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${dateStr}T00:00:00${sign}${hh}:${mm}`;
};

const makeInitialState = (reading?: TReading): TFormState => ({
  readAt: reading ? new Date(reading.readAt).toISOString().slice(0, 10) : todayIso(),
  valueT1: reading ? String(reading.valueT1) : "",
  valueT2: reading?.valueT2 != null ? String(reading.valueT2) : "",
  valueT3: reading?.valueT3 != null ? String(reading.valueT3) : "",
  notes: reading?.notes ?? "",
});

const parseValue = (s: string): number | undefined => {
  const n = parseFloat(s.replace(/,/g, ""));
  return isNaN(n) ? undefined : n;
};

export const useReadingForm = ({ meter, reading, lastReading, onClose }: TParams) => {
  const handleActionError = useActionErrorHandler({ onClose });
  const isEditMode = reading !== undefined;

  const [form, setForm] = useState<TFormState>(() => makeInitialState(reading));
  const [errors, setErrors] = useState<Partial<Record<keyof TFormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const set =
    <K extends keyof TFormState>(key: K) =>
    (value: TFormState[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
      if (formError) setFormError(null);
    };

  const t1 = parseValue(form.valueT1);
  const t2 = parseValue(form.valueT2);
  const t3 = parseValue(form.valueT3);

  const lastT1 = lastReading?.valueT1 != null ? parseFloat(String(lastReading.valueT1)) : null;
  const lastT2 = lastReading?.valueT2 != null ? parseFloat(String(lastReading.valueT2)) : null;
  const lastT3 = lastReading?.valueT3 != null ? parseFloat(String(lastReading.valueT3)) : null;

  const warningFlags: TWarningFlags = {
    t1: t1 !== undefined && lastT1 !== null && t1 < lastT1,
    t2: t2 !== undefined && lastT2 !== null && t2 < lastT2,
    t3: t3 !== undefined && lastT3 !== null && t3 < lastT3,
  };

  const hasAnyWarning = warningFlags.t1 || warningFlags.t2 || warningFlags.t3;

  const resetForm = () => {
    setForm(makeInitialState(reading));
    setErrors({});
    setFormError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFormError(null);

    const readAt = toDatetimeOffset(form.readAt);

    try {
      if (isEditMode) {
        const result = await updateReading(reading.id as ReadingId, {
          readAt,
          valueT1: t1 ?? 0,
          valueT2: meter.zoneCount >= 2 ? t2 : undefined,
          valueT3: meter.zoneCount === 3 ? t3 : undefined,
          notes: form.notes,
        });

        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            handleActionError(result.error);
          }
          return;
        }

        toast.success("Reading updated");
      } else {
        const result = await createReading({
          meterId: meter.id,
          readAt,
          valueT1: t1 ?? 0,
          valueT2: meter.zoneCount >= 2 ? t2 : undefined,
          valueT3: meter.zoneCount === 3 ? t3 : undefined,
          notes: form.notes,
        });

        if (!result.ok) {
          if (result.error.name === "ValidationError") {
            setFormError(result.error.message);
          } else {
            handleActionError(result.error);
          }
          return;
        }

        toast.success("Reading saved");
      }

      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = (() => {
    if (!form.readAt || !form.valueT1) return false;
    if (t1 === undefined) return false;
    if (meter.zoneCount >= 2 && t2 === undefined) return false;
    if (meter.zoneCount === 3 && t3 === undefined) return false;
    return true;
  })();

  return {
    form,
    set,
    errors,
    formError,
    handleSave,
    isSaving,
    canSave,
    isEditMode,
    warningFlags,
    hasAnyWarning,
    lastT1,
    lastT2,
    lastT3,
    lastReadingDate: lastReading
      ? new Date(lastReading.readAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null,
    resetForm,
  };
};
