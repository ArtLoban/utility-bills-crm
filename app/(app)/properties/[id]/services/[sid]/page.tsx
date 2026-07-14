import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getServiceDetail } from "./_data/queries";
import { ServiceTabsNav } from "./_components/service-tabs-nav";
import { PageActions } from "./_components/page-actions";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ContractTab } from "./_components/tabs/contract-tab";
import { MeterTab } from "./_components/tabs/meter-tab";
import { RemindersTab } from "./_components/tabs/reminders-tab";
import { SERVICE_TABS } from "./_components/constants";
import { resolveServiceTab } from "./_utils/resolve-tab";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { IconBadge } from "@/components/icon-badge";
import { resolveServiceLabelServer } from "@/features/services/service-label.server";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { assertNever } from "@/lib/assert-never";
import { ROUTES } from "@/lib/routes";
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

  const serviceName = await resolveServiceLabelServer(service, serviceType);
  const tNav = await getTranslations("nav");
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const providerName = currentContract?.provider.name ?? null;

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
    <PageContainer
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        { label: serviceName },
      ]}
      leading={<IconBadge icon={Icon} color={color} size="lg" border />}
      title={serviceName}
      meta={<PageMeta items={[providerName, property.name]} />}
      actions={
        <PageActions
          serviceId={service.id}
          propertyId={id}
          serviceName={serviceName}
          canEdit={canEdit}
        />
      }
    >
      <ServiceTabsNav propertyId={id} serviceId={serviceId} activeTab={activeTab} role={role} />
      {renderActiveTab()}
    </PageContainer>
  );
}
