import type { Metadata } from "next";

import { MOCK_PROPERTY_DETAIL, MOCK_SERVICES } from "../_data/mock";
import { TABS, TAB_PARAM } from "./_components/constants";
import { MetersTabPlaceholder } from "./_components/meters-tab-placeholder";
import { OverviewTab } from "./_components/overview-tab";
import { PropertyTabsNav } from "./_components/property-tabs-nav";
import { SharingTab } from "./_components/sharing-tab";
import { resolveTab } from "./_utils/resolve-tab";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PropertyMeta } from "@/app/(app)/properties/[id]/_components/property-meta";
import { PropertyActions } from "@/app/(app)/properties/[id]/_components/property-actions";

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { id: _id } = await params;
  const { name } = MOCK_PROPERTY_DETAIL;

  return {
    title: name,
    description: `Bills, meters, and services for ${name}.`,
  };
}

export default async function PropertyPage({ params, searchParams }: TProps) {
  const { id } = await params;
  const { [TAB_PARAM]: tabValue } = await searchParams;
  const tab = resolveTab(tabValue);

  const property = MOCK_PROPERTY_DETAIL;

  return (
    <PageContainer
      title={property.name}
      meta={<PropertyMeta property={property} />}
      breadcrumbs={[{ label: "Properties", href: ROUTES.properties }, { label: property.name }]}
      actions={<PropertyActions property={property} />}
    >
      <PropertyTabsNav propertyId={id} activeTab={tab} />

      {tab === TABS.OVERVIEW && <OverviewTab services={MOCK_SERVICES} propertyId={id} />}
      {tab === TABS.METERS && <MetersTabPlaceholder />}
      {tab === TABS.SHARING && <SharingTab myRole={property.myRole} propertyName={property.name} />}
    </PageContainer>
  );
}
