import { MOCK_PROPERTY_DETAIL, MOCK_SERVICES } from "../_data/mock";
import { MetersTabPlaceholder } from "./_components/meters-tab-placeholder";
import { OverviewTab } from "./_components/overview-tab";
import { PropertyHeader } from "./_components/property-header";
import { PropertyTabsNav } from "./_components/property-tabs-nav";

const VALID_TABS = ["overview", "meters", "sharing"] as const;
type TTab = (typeof VALID_TABS)[number];

const resolveTab = (raw: string | undefined): TTab => {
  const candidate = raw as TTab;
  return VALID_TABS.includes(candidate) ? candidate : "overview";
};

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function PropertyPage({ params, searchParams }: TProps) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = resolveTab(rawTab);

  const property = MOCK_PROPERTY_DETAIL;
  const services = MOCK_SERVICES;

  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "0 auto",
        padding: "32px 32px 48px",
        width: "100%",
      }}
    >
      <PropertyHeader property={property} />
      <PropertyTabsNav propertyId={id} activeTab={tab} />

      {tab === "overview" && <OverviewTab services={services} propertyId={id} />}
      {tab === "meters" && <MetersTabPlaceholder />}
      {tab === "sharing" && (
        <div className="text-zinc-500" style={{ fontSize: 14 }}>
          Sharing tab — coming soon
        </div>
      )}
    </div>
  );
}
