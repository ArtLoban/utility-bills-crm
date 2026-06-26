import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import { PageShell } from "@/components/page-shell";
import { assertNever } from "@/lib/assert-never";
import { getMeterDetail } from "./_data/queries";
import { MeterPageHeader } from "./_components/meter-page-header";
import { MeterTabsNav } from "./_components/meter-tabs-nav";
import { METER_TABS } from "./_components/constants";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ReadingsTab } from "./_components/tabs/readings-tab";
import { resolveMeterTab } from "./_utils/resolve-tab";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = {
  title: "Meter",
};

export default async function MeterPage({ params, searchParams }: TProps) {
  const { id, mid } = await params;
  const { tab } = await searchParams;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();

  const property = propertyResult.value;
  const { meter, serviceType } = meterResult.value;

  if (meter.propertyId !== id) notFound();

  const activeTab = resolveMeterTab(tab);
  const canMutate = property.role !== PROPERTY_ROLES.VIEWER;

  const renderActiveTab = (): ReactNode => {
    switch (activeTab) {
      case METER_TABS.OVERVIEW:
        return <OverviewTab meter={meter} serviceType={serviceType} propertyName={property.name} />;
      case METER_TABS.READINGS:
        return <ReadingsTab meter={meter} serviceType={serviceType} role={property.role} />;
      default:
        return assertNever(activeTab);
    }
  };

  return (
    <PageShell>
      <MeterPageHeader
        meter={meter}
        serviceType={serviceType}
        propertyId={id}
        propertyName={property.name}
        canMutate={canMutate}
      />
      <MeterTabsNav propertyId={id} meterId={meterId} activeTab={activeTab} />
      {renderActiveTab()}
    </PageShell>
  );
}
