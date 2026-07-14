import { getContractHistory, getAttributeHistory } from "../../_data/queries";
import type { TAttributeHistory } from "../../_data/queries";
import { ContractCard } from "../contract-card";
import type { TCurrentContractSummary } from "@/lib/db/access/services";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";

const EMPTY_ATTRIBUTE_HISTORY: TAttributeHistory = {
  tariffsByContract: {},
  accountNumbersByContract: {},
  paymentDetailsByContract: {},
};

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceType: TServiceType;
  currentContract: TCurrentContractSummary | null;
  currentTariff: TTariff | null;
  currentAccountNumber: TAccountNumber | null;
  currentPaymentDetails: TPaymentDetails | null;
  role: TPropertyRole;
};

export const ContractTab = async ({
  serviceId,
  propertyId,
  serviceType,
  currentContract,
  currentTariff,
  currentAccountNumber,
  currentPaymentDetails,
  role,
}: TProps) => {
  const [historyResult, attributeHistoryResult] = await Promise.all([
    getContractHistory(serviceId),
    getAttributeHistory(serviceId),
  ]);

  return (
    <ContractCard
      serviceId={serviceId}
      propertyId={propertyId}
      serviceType={serviceType}
      currentContract={currentContract}
      currentTariff={currentTariff}
      currentAccountNumber={currentAccountNumber}
      currentPaymentDetails={currentPaymentDetails}
      contractHistory={historyResult.ok ? historyResult.value : []}
      attributeHistory={
        attributeHistoryResult.ok ? attributeHistoryResult.value : EMPTY_ATTRIBUTE_HISTORY
      }
      role={role}
    />
  );
};
