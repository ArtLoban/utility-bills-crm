"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { usePropertyForm } from "@/features/properties/hooks/use-property-form";
import { PropertyForm } from "./property-form";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = {
  property?: TPropertyDetail;
};

export const PropertyFormContent = ({ property }: TProps) => {
  const router = useRouter();
  const t = useTranslations("properties");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, isEditMode } = usePropertyForm({ property, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={ROUTES.properties}
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      cancelText={t("modal.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <PropertyForm form={form} />
    </FormContainer>
  );
};
