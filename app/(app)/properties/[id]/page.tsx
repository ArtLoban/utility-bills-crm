import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { servicesByPropertyId } from "@/lib/db/access/services";
import { getPropertyDetail } from "./_data/queries";
import { OverviewTab } from "./_components/overview-tab";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PropertyMeta } from "./_components/property-meta";
import { PropertyActions } from "./_components/property-actions";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";

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
  const [session, result] = await Promise.all([auth(), getPropertyDetail(id as PropertyId)]);

  if (!result.ok) notFound();

  const property = result.value;

  // auth() is memoized per request via React cache — no extra round-trip.
  const userId = session?.user?.id as UserId | undefined;
  const servicesResult = userId
    ? await servicesByPropertyId(userId, id as PropertyId)
    : { ok: false as const };
  const services = servicesResult.ok ? servicesResult.value : [];

  return (
    <PageContainer
      title={property.name}
      meta={<PropertyMeta property={property} />}
      breadcrumbs={[{ label: "Properties", href: ROUTES.properties }, { label: property.name }]}
      actions={<PropertyActions property={property} />}
    >
      <OverviewTab services={services} role={property.role} propertyId={id} />
    </PageContainer>
  );
}
