"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useZodForm } from "@/lib/forms/use-zod-form";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ERROR_CODES } from "@/lib/errors";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";

import { INVITE_ERROR, inviteFormSchema } from "../schema";
import { InviteFormField } from "../types";
import { inviteToProperty } from "../actions";

type TParams = {
  propertyId: string;
  onClose: () => void;
};

export const useInviteForm = ({ propertyId, onClose }: TParams) => {
  const t = useTranslations("sharing");
  const handleActionError = useActionErrorHandler({ onClose });

  const form = useZodForm({
    schema: inviteFormSchema,
    namespace: "sharing",
    defaultValues: {
      [InviteFormField.EMAIL]: "",
      [InviteFormField.ROLE]: PROPERTY_ROLES.EDITOR,
    },
    mode: "onTouched",
  });

  const handleSave = form.handleSubmit(async (data) => {
    const result = await inviteToProperty(propertyId as PropertyId, {
      email: data.email.trim(),
      role: data.role,
    });

    if (!result.ok) {
      if (result.error.code === ERROR_CODES.VALIDATION) {
        if (result.error.message === INVITE_ERROR.USER_NOT_FOUND) {
          form.setError("email", { message: t("inviteModal.errors.userNotFound") });
          return;
        }
        if (result.error.message === INVITE_ERROR.ALREADY_HAS_ACCESS) {
          form.setError("email", { message: t("inviteModal.errors.alreadyHasAccess") });
          return;
        }
      }
      handleActionError(result.error);
      return;
    }

    toast.success(t("toast.inviteSuccess"));
    onClose();
  });

  return {
    form,
    handleSave,
    isSaving: form.formState.isSubmitting,
  };
};
