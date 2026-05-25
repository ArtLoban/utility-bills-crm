import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getServiceDetail, getProvidersForContractPage } from "../../_data/queries";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import { NewContractForm } from "./_components/new-contract-form";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function NewContractPage({ params }: TProps) {
  const { id, sid } = await params;
  const propertyId = id as PropertyId;
  const serviceId = sid as TServiceId;

  const [propertyResult, serviceResult, providers] = await Promise.all([
    getPropertyDetail(propertyId),
    getServiceDetail(serviceId),
    getProvidersForContractPage(),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === "viewer") notFound();

  const { serviceType } = serviceResult.value;

  return (
    <PageContainer
      title="Add contract"
      breadcrumbs={[
        { label: "Properties", href: ROUTES.properties },
        { label: propertyResult.value.name, href: `/properties/${id}` },
        { label: serviceType.code, href: `/properties/${id}/services/${sid}` },
        { label: "Add contract" },
      ]}
    >
      <div className="max-w-2xl">
        <NewContractForm serviceId={serviceId} providers={providers} />
      </div>
    </PageContainer>
  );
}
