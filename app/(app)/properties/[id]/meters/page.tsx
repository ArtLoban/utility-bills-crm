import { Breadcrumbs } from "@/components/breadcrumbs";
import { MOCK_METERS } from "./_data/mock";
import { MetersClient } from "./_components/meters-client";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function MetersPage({ params }: TProps) {
  const { id } = await params;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px 80px", width: "100%" }}>
      <Breadcrumbs
        items={[
          { label: "Properties", href: "/properties" },
          { label: "Main apartment", href: `/properties/${id}` },
          { label: "Meters" },
        ]}
      />
      <MetersClient propertyId={id} meters={MOCK_METERS} />
    </div>
  );
}
