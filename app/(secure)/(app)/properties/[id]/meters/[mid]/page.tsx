import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { IconBadge } from "@/components/icon-badge";
import { Badge } from "@/components/ui/badge";
import { assertNever } from "@/lib/assert-never";
import { ROUTES } from "@/lib/routes";
import { formatDisplayDate } from "@/lib/format/date";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { resolveServiceTypeLabelServer } from "@/features/services/service-label.server";
import { getMeterDetail } from "./_data/queries";
import { MeterTabsNav } from "./_components/meter-tabs-nav";
import { METER_TABS } from "./_components/constants";
import { PageActions } from "./_components/page-actions";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ReadingsTab } from "./_components/tabs/readings-tab";
import { resolveMeterTab } from "./_utils/resolve-tab";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
  searchParams: Promise<Record<string, string>>;
};

export const metadata: Metadata = {
  title: "Meter",
};

export default async function MeterPage({ params, searchParams }: TProps) {
  const { id, mid } = await params;
  const resolvedSearchParams = await searchParams;
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

  const activeTab = resolveMeterTab(resolvedSearchParams.tab);
  const canMutate = property.role !== PROPERTY_ROLES.VIEWER;

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const [tNav, tDetail] = await Promise.all([
    getTranslations("nav"),
    getTranslations("meters.detail"),
  ]);
  const meterTitle = tDetail("title", { type: await resolveServiceTypeLabelServer(serviceType) });
  const isHistorical = meter.validTo !== null;

  const renderActiveTab = (): ReactNode => {
    switch (activeTab) {
      case METER_TABS.OVERVIEW:
        return <OverviewTab meter={meter} serviceType={serviceType} propertyName={property.name} />;
      case METER_TABS.READINGS:
        return (
          <ReadingsTab
            meter={meter}
            serviceType={serviceType}
            role={property.role}
            searchParams={resolvedSearchParams}
          />
        );
      default:
        return assertNever(activeTab);
    }
  };

  return (
    <PageContainer
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        { label: meterTitle },
      ]}
      leading={<IconBadge icon={Icon} color={color} size="lg" border />}
      title={
        <span className="flex items-center gap-3">
          {meterTitle}
          {isHistorical && <Badge>{tDetail("badge.historical")}</Badge>}
        </span>
      }
      meta={
        <PageMeta
          items={[
            <span key="zones" style={{ color }}>
              {tDetail("meta.zones", { count: meter.zoneCount })}
            </span>,
            meter.serialNumber ? (
              <span key="serial" className="font-mono">
                {tDetail("meta.serial", { value: meter.serialNumber })}
              </span>
            ) : null,
            meter.installedAt
              ? tDetail("meta.installed", { date: formatDisplayDate(meter.installedAt) })
              : null,
          ]}
        />
      }
      actions={<PageActions meter={meter} meterTitle={meterTitle} canMutate={canMutate} />}
    >
      <MeterTabsNav propertyId={id} meterId={meterId} activeTab={activeTab} />
      {renderActiveTab()}
    </PageContainer>
  );
}
