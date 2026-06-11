"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import { useBillForm } from "@/features/bills/hooks/use-bill-form";
import { BillForm } from "./bill-form";

type TProps = {
  bill?: TBillGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
};

export const BillFormContent = ({ bill, propertyOptions = [], serviceOptions = {} }: TProps) => {
  const router = useRouter();
  const t = useTranslations("bills");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const {
    form,
    handleSave,
    isSaving,
    isEditMode,
    availableServices,
    expectedAmount,
    resetService,
    lockedPropertyName,
    lockedServiceCode,
  } = useBillForm({ bill, serviceOptions, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={ROUTES.bills}
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      cancelText={t("modal.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <BillForm
        form={form}
        isEditMode={isEditMode}
        propertyOptions={propertyOptions}
        availableServices={availableServices}
        expectedAmount={expectedAmount}
        onPropertyChange={resetService}
        lockedPropertyName={lockedPropertyName}
        lockedServiceCode={lockedServiceCode}
      />
    </FormContainer>
  );
};
