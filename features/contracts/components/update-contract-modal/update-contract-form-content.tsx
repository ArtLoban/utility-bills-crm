"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { UPDATE_CONTRACT_NAMESPACE } from "./constants";
import { useUpdateContract } from "./hooks/use-update-contract";
import { UpdateContractFields } from "./update-contract-fields";

type TProps = {
  contractId: TContractId;
  serviceId: TServiceId;
  serviceType: TServiceType;
  propertyId: string;
};

export const UpdateContractFormContent = ({
  contractId,
  serviceId,
  serviceType,
  propertyId,
}: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const tForm = useTranslations("common.form");
  const router = useRouter();
  const onClose = () => router.back();

  const { selected, setSelected, tariff, account, payment, isProvider, isSaving, handleConfirm } =
    useUpdateContract({ contractId, serviceId, propertyId, onClose });

  return (
    <FormContainer
      onSubmit={handleConfirm}
      backHref={`${ROUTES.properties}/${propertyId}/services/${serviceId}`}
      size="md"
      submitText={isProvider ? t("goToProvider") : t("apply")}
      cancelText={t("cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      isSaving={isSaving}
    >
      <UpdateContractFields
        serviceType={serviceType}
        selected={selected}
        onSelect={setSelected}
        tariffForm={tariff.form}
        accountForm={account.form}
        paymentForm={payment.form}
      />
    </FormContainer>
  );
};
