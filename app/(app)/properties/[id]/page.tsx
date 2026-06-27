import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth/guards";
import { assertNever } from "@/lib/assert-never";
import { servicesByPropertyId } from "@/lib/db/access/services";
import { lastReadingDatesByServiceType } from "@/lib/db/access/readings";
import { balancesForServices } from "@/features/ledger";
import type { TBalance } from "@/features/ledger";
import { propertyMembers, SharingTab } from "@/features/sharing";
import { getPropertyDetail } from "./_data/queries";
import { OverviewTab } from "./_components/overview-tab";
import { PropertyTabsNav } from "./_components/property-tabs-nav";
import { TABS } from "./_components/constants";
import { resolveTab } from "./_utils/resolve-tab";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PropertyMeta } from "./_components/property-meta";
import { PropertyActions } from "./_components/property-actions";
import { getPropertyMeters } from "./meters/_data/queries";
import { MetersClient } from "./meters/_components/meters-client";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPropertyDetail(id as PropertyId);
  if (!result.ok) return { title: "Property" };

  return {
    title: result.value.name,
    description: `Bills, meters, and services for ${result.value.name}.`,
  };
}

export default async function PropertyPage({ params, searchParams }: TProps) {
  const userId = await requireUser();
  const { id } = await params;
  const { tab } = await searchParams;
  const propertyId = id as PropertyId;
  const activeTab = resolveTab(tab);

  const result = await getPropertyDetail(propertyId);
  if (!result.ok) notFound();

  const property = result.value;
  const tNav = await getTranslations("nav");

  let tabContent: ReactNode;

  switch (activeTab) {
    case TABS.OVERVIEW: {
      const servicesResult = await servicesByPropertyId(userId, propertyId);
      const services = servicesResult.ok ? servicesResult.value : [];
      const serviceIds = services.map((s) => s.service.id as TServiceId);
      const [serviceBalances, lastReadingByServiceType] = await Promise.all([
        serviceIds.length > 0 ? balancesForServices(serviceIds) : new Map<TServiceId, TBalance>(),
        lastReadingDatesByServiceType(propertyId),
      ]);

      tabContent = (
        <OverviewTab
          services={services}
          role={property.role}
          propertyId={id}
          serviceBalances={serviceBalances}
          lastReadingByServiceType={lastReadingByServiceType}
        />
      );
      break;
    }
    case TABS.METERS: {
      const metersResult = await getPropertyMeters(propertyId);
      if (!metersResult.ok) notFound();

      tabContent = (
        <MetersClient propertyId={id} meters={metersResult.value} role={property.role} />
      );
      break;
    }
    case TABS.SHARING: {
      const membersResult = await propertyMembers(userId, propertyId);
      if (!membersResult.ok) notFound();

      tabContent = (
        <SharingTab
          propertyId={propertyId}
          members={membersResult.value}
          currentUserId={userId}
          propertyName={property.name}
        />
      );
      break;
    }
    default:
      assertNever(activeTab);
  }

  return (
    <PageContainer
      title={property.name}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: property.name },
      ]}
      actions={<PropertyActions property={property} />}
      meta={<PropertyMeta property={property} />}
    >
      <PropertyTabsNav propertyId={id} activeTab={activeTab} />
      {tabContent}
    </PageContainer>
  );
}
