import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getServiceDetail } from "./_data/queries";
import { ServicePageHeader } from "./_components/service-page-header";
import { ServiceTabsNav } from "./_components/service-tabs-nav";
import { DeleteServiceAction } from "./_components/delete-service-action";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ContractTab } from "./_components/tabs/contract-tab";
import { MeterTab } from "./_components/tabs/meter-tab";
import { RemindersTab } from "./_components/tabs/reminders-tab";
import { SERVICE_TABS } from "./_components/constants";
import { resolveServiceTab } from "./_utils/resolve-tab";
import { PageShell } from "@/components/page-shell";
import { assertNever } from "@/lib/assert-never";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ServicePage({ params, searchParams }: TProps) {
  const { id, sid } = await params;
  const { tab } = await searchParams;
  const propertyId = id as PropertyId;
  const serviceId = sid as TServiceId;

  const [propertyResult, serviceResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getServiceDetail(serviceId),
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

  const activeTab = resolveServiceTab(tab, role);
  const canEdit = role !== PROPERTY_ROLES.VIEWER;

  const tTypes = await getTranslations("services.types");
  const serviceName = tTypes(serviceType.code as Parameters<typeof tTypes>[0]);

  const renderActiveTab = (): ReactNode => {
    switch (activeTab) {
      case SERVICE_TABS.OVERVIEW:
        return <OverviewTab serviceId={serviceId} notes={service.notes ?? null} />;
      case SERVICE_TABS.CONTRACT:
        return (
          <ContractTab
            serviceId={serviceId}
            propertyId={id}
            serviceType={serviceType}
            currentContract={currentContract}
            currentTariff={currentTariff}
            currentAccountNumber={currentAccountNumber}
            currentPaymentDetails={currentPaymentDetails}
            role={role}
          />
        );
      case SERVICE_TABS.METER:
        return (
          <MeterTab
            serviceId={serviceId}
            propertyId={id}
            serviceType={serviceType}
            propertyName={property.name}
            canEdit={canEdit}
          />
        );
      case SERVICE_TABS.REMINDERS:
        return <RemindersTab serviceId={serviceId} propertyId={id} />;
      default:
        return assertNever(activeTab);
    }
  };

  return (
    <PageShell>
      <ServicePageHeader
        service={service}
        serviceType={serviceType}
        role={role}
        propertyId={id}
        propertyName={property.name}
        providerName={currentContract?.provider.name ?? null}
        extraActions={
          canEdit ? (
            <DeleteServiceAction serviceId={service.id} propertyId={id} serviceName={serviceName} />
          ) : undefined
        }
      />
      <ServiceTabsNav propertyId={id} serviceId={serviceId} activeTab={activeTab} role={role} />
      {renderActiveTab()}
    </PageShell>
  );
}
