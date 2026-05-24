import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getAddServicePageData } from "./_data/queries";
import { AddServiceFormContent } from "@/features/services";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function NewServicePage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, dataResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getAddServicePageData(propertyId),
  ]);

  if (!propertyResult.ok || propertyResult.value.role === "viewer") notFound();
  if (!dataResult.ok) notFound();

  const property = propertyResult.value;

  return (
    <PageContainer
      title="Add service"
      breadcrumbs={[
        { label: "Properties", href: ROUTES.properties },
        { label: property.name, href: `/properties/${id}` },
        { label: "Add service" },
      ]}
    >
      <div className="max-w-2xl">
        <AddServiceFormContent
          propertyId={propertyId}
          serviceTypes={dataResult.value.allServiceTypes}
          existingTypeIds={dataResult.value.existingTypeIds}
        />
      </div>
    </PageContainer>
  );
}
