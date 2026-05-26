import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import {
  getAttributeHistory,
  getContractHistory,
  getCurrentMeterForService,
  getServiceDetail,
} from "./_data/queries";
import { ActivityCard } from "./_components/activity-card";
import { BalanceCard } from "./_components/balance-card";
import { ContractCard } from "./_components/contract-card";
import { MeterCard } from "./_components/meter-card";
import { NotesCard } from "./_components/notes-card";
import { ServicePageHeader } from "./_components/service-page-header";
import { DeleteServiceAction } from "./_components/delete-service-action";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function ServicePage({ params }: TProps) {
  const { id, sid } = await params;

  const [propertyResult, serviceResult, historyResult, attributeHistoryResult, currentMeter] =
    await Promise.all([
      getPropertyDetail(id as PropertyId),
      getServiceDetail(sid as TServiceId),
      getContractHistory(sid as TServiceId),
      getAttributeHistory(sid as TServiceId),
      getCurrentMeterForService(sid as TServiceId),
    ]);

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
        <BalanceCard />
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
        <ActivityCard />
        <NotesCard notes={service.notes ?? null} editHref={editHref} role={role} />
      </div>
    </div>
  );
}
