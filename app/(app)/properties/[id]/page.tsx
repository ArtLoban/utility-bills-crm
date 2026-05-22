import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPropertyDetail } from "./_data/queries";
import { OverviewTab } from "./_components/overview-tab";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PropertyMeta } from "./_components/property-meta";
import { PropertyActions } from "./_components/property-actions";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
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

export default async function PropertyPage({ params }: TProps) {
  const { id } = await params;
  const result = await getPropertyDetail(id as PropertyId);

  if (!result.ok) notFound();

  const property = result.value;

  return (
    <PageContainer
      title={property.name}
      meta={<PropertyMeta property={property} />}
      breadcrumbs={[{ label: "Properties", href: ROUTES.properties }, { label: property.name }]}
      actions={<PropertyActions property={property} />}
    >
      <OverviewTab services={[]} propertyId={id} />
    </PageContainer>
  );
}
