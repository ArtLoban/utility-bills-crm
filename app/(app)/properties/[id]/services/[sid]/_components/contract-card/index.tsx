import { format } from "date-fns";
import { FileText } from "lucide-react";
import Link from "next/link";

import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TCurrentContractSummary } from "@/lib/db/access/services";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";
import type { TAttributeHistory } from "../../_data/queries";
import { ContractCardClient } from "./components/contract-card-client";
import { TariffRateChips } from "./components/tariff-rate-chips";
import { UpdateContractButton } from "./components/update-contract-button";

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

const ContractCard = ({
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
  const canEdit = role !== "viewer";
  const newContractHref = `/properties/${propertyId}/services/${serviceId}/contract/new`;

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <span
          className="text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
        >
          Current contract
        </span>

        {currentContract && contractHistory.length > 1 && (
          <ContractCardClient
            contractHistory={contractHistory}
            attributeHistory={attributeHistory}
          />
        )}
      </div>

      {/* Body */}
      {currentContract ? (
        <div style={{ padding: "20px 20px" }}>
          {/* Provider row */}
          <div className="mb-5 flex items-start gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "var(--field-tint-bg, #f5f3ff)",
                border: "1px solid var(--field-tint-border, #ede9fe)",
              }}
            >
              <span style={{ fontSize: 16 }}>⚡</span>
            </div>
            <div>
              <p
                className="text-zinc-950 dark:text-zinc-50"
                style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}
              >
                {currentContract.provider.name}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5 }}>
                In effect since {format(currentContract.contract.validFrom, "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Tariff */}
          {currentTariff && (
            <div className="mb-4">
              <p
                className="mb-2 text-zinc-500 dark:text-zinc-400"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Tariff
              </p>
              <TariffRateChips tariff={currentTariff} serviceUnit={serviceType.unit ?? null} />
            </div>
          )}

          {/* Account number */}
          {currentAccountNumber && (
            <div className="mb-4">
              <p
                className="mb-1 text-zinc-500 dark:text-zinc-400"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Account number
              </p>
              <p
                className="text-zinc-950 dark:text-zinc-50"
                style={{ fontSize: 13.5, fontFeatureSettings: '"tnum" 1' }}
              >
                {currentAccountNumber.value}
              </p>
            </div>
          )}

          {/* Payment details */}
          {currentPaymentDetails && (
            <div className="mb-4">
              <p
                className="mb-1 text-zinc-500 dark:text-zinc-400"
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Payment details
              </p>
              <p
                className="whitespace-pre-wrap text-zinc-950 dark:text-zinc-50"
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                }}
              >
                {currentPaymentDetails.details}
              </p>
            </div>
          )}

          {/* Contract notes */}
          {currentContract.contract.notes && (
            <p
              className="mb-4 rounded-lg px-3 py-2.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400"
              style={{
                fontSize: 13,
                background: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {currentContract.contract.notes}
            </p>
          )}

          {/* Actions */}
          {canEdit && (
            <div className="flex items-center gap-2">
              <UpdateContractButton
                contractId={currentContract.contract.id}
                serviceId={serviceId}
                serviceType={serviceType}
                propertyId={propertyId}
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
          <FileText size={28} className="text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
            No contract added yet.
          </p>
          {canEdit && (
            <Link
              href={newContractHref}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border text-sm font-medium transition-colors"
              style={{
                height: 32,
                padding: "0 14px",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                background: "var(--background)",
              }}
            >
              Add contract
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export { ContractCard };
