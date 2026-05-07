import { MOCK_PROPERTY_DETAIL, MOCK_SERVICES } from "../_data/mock";
import { TABS, TAB_PARAM, type TTab } from "./_components/constants";
import { MetersTabPlaceholder } from "./_components/meters-tab-placeholder";
import { OverviewTab } from "./_components/overview-tab";
import { PropertyHeader } from "./_components/property-header";
import { PropertyTabsNav } from "./_components/property-tabs-nav";
import { SharingTab } from "./_components/sharing-tab";

const resolveTab = (tabValue?: string): TTab => {
  return Object.values(TABS).find((tab): tab is TTab => tab === tabValue) ?? TABS.OVERVIEW;
};

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function PropertyPage({ params, searchParams }: TProps) {
  const { id } = await params;
  const { [TAB_PARAM]: tabValue } = await searchParams;
  const tab = resolveTab(tabValue);

  const property = MOCK_PROPERTY_DETAIL;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-8 pt-8 pb-12">
      <PropertyHeader property={property} />
      <PropertyTabsNav propertyId={id} activeTab={tab} />

      {tab === TABS.OVERVIEW && <OverviewTab services={MOCK_SERVICES} propertyId={id} />}
      {tab === TABS.METERS && <MetersTabPlaceholder />}
      {tab === TABS.SHARING && <SharingTab myRole={property.myRole} propertyName={property.name} />}
    </div>
  );
}
