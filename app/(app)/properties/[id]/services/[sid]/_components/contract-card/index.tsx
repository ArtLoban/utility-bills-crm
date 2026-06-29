import { Settings2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { ROUTES } from "@/lib/routes";
import { formatDisplayDate } from "@/lib/format/date";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TCurrentContractSummary } from "@/lib/db/access/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import type { TAttributeHistory } from "../../_data/queries";
import { ContractHistory } from "./components/contract-history";
import { TariffRateChips } from "./components/tariff-rate-chips";
import { EmptyContract } from "@/app/(app)/properties/[id]/services/[sid]/_components/contract-card/components/empty-contract";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceType: TServiceType;
  currentContract: TCurrentContractSummary | null;
  currentTariff: TTariff | null;
  currentAccountNumber: TAccountNumber | null;
  currentPaymentDetails: TPaymentDetails | null;
  contractHistory: TContractWithProvider[];
  attributeHistory: TAttributeHistory;
  role: TPropertyRole;
};

export const ContractCard = async ({
  serviceId,
  propertyId,
  serviceType,
  currentContract,
  currentTariff,
  currentAccountNumber,
  currentPaymentDetails,
  contractHistory,
  attributeHistory,
  role,
}: TProps) => {
  const t = await getTranslations("services.detail.contract");
  const canEdit = role !== PROPERTY_ROLES.VIEWER;
  const baseHref = `${ROUTES.properties}/${propertyId}/services/${serviceId}/contract`;

  if (!currentContract) return <EmptyContract canEdit={canEdit} href={`${baseHref}/new`} />;

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);

  return (
    <SectionCard
      title={t("title")}
      description={t("subtitle")}
      actions={
        <div className="flex items-center gap-2">
          {canEdit && (
            <LinkButton
              href={`${baseHref}/update`}
              icon={Settings2}
              text={t("updateContract")}
              variant="default"
            />
          )}
          <ContractHistory contractHistory={contractHistory} attributeHistory={attributeHistory} />
        </div>
      }
    >
      <div className="p-5">
        <div className="mb-5 flex items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "var(--field-tint-bg)",
              border: "1px solid var(--field-tint-border)",
            }}
          >
            <Icon className="size-4" style={{ color }} />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold tracking-[-0.1px]">
              {currentContract.provider.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {t("inEffectSince", { date: formatDisplayDate(currentContract.contract.validFrom) })}
            </p>
          </div>
        </div>

        {currentTariff && (
          <div className="mb-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              {t("tariff")}
            </p>
            <TariffRateChips tariff={currentTariff} serviceUnit={serviceType.unit} />
          </div>
        )}

        {currentAccountNumber && (
          <div className="mb-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              {t("accountNumber")}
            </p>
            <p className="text-foreground text-sm tabular-nums">{currentAccountNumber.value}</p>
          </div>
        )}

        {currentPaymentDetails && (
          <div className="mb-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              {t("paymentDetails")}
            </p>
            <p className="text-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {currentPaymentDetails.details}
            </p>
          </div>
        )}

        {currentContract.contract.notes && (
          <p className="bg-muted border-border text-muted-foreground rounded-lg border px-3 py-2.5 text-sm whitespace-pre-wrap">
            {currentContract.contract.notes}
          </p>
        )}
      </div>
    </SectionCard>
  );
};
