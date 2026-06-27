"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useReplaceMeterForm } from "@/features/meters/hooks/use-replace-meter-form";
import type { TMeter } from "@/lib/db/schema/meters";
import { ReplaceMeterForm } from "./replace-meter-form";

type TProps = {
  meter: TMeter;
  supportsZones: boolean;
};

export const ReplaceMeterFormContent = ({ meter, supportsZones }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.replaceForm");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useReplaceMeterForm({ meter, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}`}
      submitText={t("actions.replace")}
      cancelText={t("actions.cancel")}
      savingText={t("actions.replacing")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <ReplaceMeterForm form={form} meter={meter} supportsZones={supportsZones} />
    </FormContainer>
  );
};
