"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { DomainError } from "@/lib/errors";

type TOptions = {
  onClose?: () => void;
};

export const useActionErrorHandler = ({ onClose }: TOptions) => {
  const t = useTranslations("common");

  return (error: DomainError) => {
    if (error.name === "DemoModeError") {
      // Intentionally no onClose — leave the modal open so the demo user keeps exploring.
      toast.info(t("demoBlocked"));
      return;
    }
    toast.error(t("saveError"));
    onClose?.();
  };
};
