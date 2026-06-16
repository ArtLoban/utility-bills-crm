import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { balancesForServices } from "@/features/ledger";
import type { TBalance } from "@/features/ledger";
import { RemindersSection } from "@/features/notifications";
import {
  getAttributeHistory,
  getContractHistory,
  getCurrentMeterForService,
  getLastReadingForMeter,
  getRemindersForService,
  getServiceDetail,
  getTelegramLinked,
} from "./_data/queries";
import { ActivityCard } from "./_components/activity-card";
import { BalanceCard } from "./_components/balance-card";
import { ContractCard } from "./_components/contract-card";
import { MeterCard } from "./_components/meter-card";
import { NotesCard } from "./_components/notes-card";
import { QuickActions } from "./_components/quick-actions";
import { ServicePageHeader } from "./_components/service-page-header";
import { DeleteServiceAction } from "./_components/delete-service-action";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

const ZERO_BALANCE: TBalance = { billsTotal: 0, paymentsTotal: 0, balance: 0 };

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function ServicePage({ params }: TProps) {
  const { id, sid } = await params;

  const [
    propertyResult,
    serviceResult,
    historyResult,
    attributeHistoryResult,
    currentMeter,
    serviceBalances,
    reminders,
    isTelegramLinked,
  ] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getServiceDetail(sid as TServiceId),
    getContractHistory(sid as TServiceId),
    getAttributeHistory(sid as TServiceId),
    getCurrentMeterForService(sid as TServiceId),
    balancesForServices([sid as TServiceId]),
    getRemindersForService(sid as TServiceId),
    getTelegramLinked(),
  ]);

  const lastMeterReading = currentMeter ? await getLastReadingForMeter(currentMeter) : null;

  if (!propertyResult.ok || !serviceResult.ok) notFound();

  const property = propertyResult.value;
  const {
    service,
    serviceType,
    role,
    currentContract,
    currentTariff,
    currentAccountNumber,
    currentPaymentDetails,
  } = serviceResult.value;

  const t = await getTranslations("services.types");
  const serviceName = t(serviceType.code as Parameters<typeof t>[0]);
  const editHref = `/properties/${id}/services/${sid}/edit`;

  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "28px 32px 56px", width: "100%" }}>
      <ServicePageHeader
        service={service}
        serviceType={serviceType}
        role={role}
        propertyId={id}
        propertyName={property.name}
        extraActions={
          role !== "viewer" ? (
            <DeleteServiceAction serviceId={service.id} propertyId={id} serviceName={serviceName} />
          ) : undefined
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BalanceCard balance={serviceBalances.get(sid as TServiceId) ?? ZERO_BALANCE} />
        <ContractCard
          serviceId={sid as TServiceId}
          propertyId={id}
          serviceType={serviceType}
          currentContract={currentContract}
          currentTariff={currentTariff}
          currentAccountNumber={currentAccountNumber}
          currentPaymentDetails={currentPaymentDetails}
          contractHistory={historyResult.ok ? historyResult.value : []}
          attributeHistory={
            attributeHistoryResult.ok
              ? attributeHistoryResult.value
              : {
                  tariffsByContract: {},
                  accountNumbersByContract: {},
                  paymentDetailsByContract: {},
                }
          }
          role={role}
        />
        <MeterCard meter={currentMeter} propertyId={id} />
        {currentMeter && role !== "viewer" && (
          <QuickActions
            meter={currentMeter}
            serviceType={serviceType}
            propertyName={property.name}
            lastReading={lastMeterReading}
          />
        )}
        <ActivityCard />
        <NotesCard notes={service.notes ?? null} editHref={editHref} role={role} />
        {role !== "viewer" && (
          <RemindersSection
            reminders={reminders}
            isTelegramLinked={isTelegramLinked}
            propertyId={id}
            serviceId={sid as TServiceId}
          />
        )}
      </div>
    </div>
  );
}
