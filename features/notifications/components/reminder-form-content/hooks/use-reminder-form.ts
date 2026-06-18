"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import type { TReminderAnchorType } from "@/lib/db/schema/notifications";
import type { TServiceId } from "@/lib/db/schema/services";

import { createReminder, editReminder } from "../../../actions";
import { reminderFormSchema } from "../../../schema";
import { REMINDER_ANCHOR_DEFAULT_VALUE } from "../../../constants";
import type { TReminderListItem } from "../../../query";
import { buildDefaultValues } from "../utils/build-default-values";
import { toCreateInput, toEditInput } from "../utils/to-action-input";

type TParams = {
  serviceId: TServiceId;
  reminder?: TReminderListItem;
  onSuccess: () => void;
};

export const useReminderForm = ({ serviceId, reminder, onSuccess }: TParams) => {
  const t = useTranslations("reminders");
  const handleActionError = useActionErrorHandler({});
  const isEditMode = reminder !== undefined;

  const form = useZodForm({
    schema: reminderFormSchema,
    namespace: "reminders",
    defaultValues: buildDefaultValues(reminder),
    mode: "onTouched",
  });

  const handleAnchorTypeChange = (next: TReminderAnchorType) => {
    form.setValue("anchorType", next, { shouldValidate: true });
    form.setValue("anchorValue", String(REMINDER_ANCHOR_DEFAULT_VALUE[next]), {
      shouldValidate: true,
    });
  };

  const handleSave = form.handleSubmit(async (values) => {
    const response = isEditMode
      ? await editReminder(reminder.id, toEditInput(values))
      : await createReminder(toCreateInput(values, serviceId));

    if (!response.ok) {
      if (response.error.code === ERROR_CODES.VALIDATION) {
        form.setError("root", { message: t("modal.formError") });
        return;
      }
      handleActionError(response.error);
      return;
    }

    toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
    onSuccess();
  });

  return {
    form,
    handleSave,
    handleAnchorTypeChange,
    isSaving: form.formState.isSubmitting,
    isEditMode,
  };
};
