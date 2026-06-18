"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ERROR_CODES, type TAppError } from "@/lib/errors";

type TOptions = {
  onClose?: () => void;
};

export const useActionErrorHandler = ({ onClose }: TOptions) => {
  const t = useTranslations("common");

  return (error: TAppError) => {
    if (error.code === ERROR_CODES.DEMO_MODE) {
      // Intentionally no onClose — leave the modal open so the demo user keeps exploring.
      toast.warning(t("demoBlocked"));
      return;
    }
    toast.error(t("saveError"));
    onClose?.();
  };
};
