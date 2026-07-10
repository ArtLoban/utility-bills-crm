"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
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
  zoneCount: number;
  propertyId: string;
};

export const UpdateContractModal = ({
  contractId,
  serviceId,
  serviceType,
  zoneCount,
  propertyId,
}: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const router = useRouter();
  const onClose = () => router.back();

  const { selected, setSelected, tariff, account, payment, isProvider, isSaving, handleConfirm } =
    useUpdateContract({ contractId, serviceId, propertyId, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("title")}
      description={t("prompt")}
      size="lg"
      onConfirm={handleConfirm}
      confirmLabel={isProvider ? t("goToProvider") : t("apply")}
      cancelLabel={t("cancel")}
      isSaving={isSaving}
    >
      <UpdateContractFields
        serviceType={serviceType}
        zoneCount={zoneCount}
        selected={selected}
        onSelect={setSelected}
        tariffForm={tariff.form}
        accountForm={account.form}
        paymentForm={payment.form}
      />
    </Modal>
  );
};
