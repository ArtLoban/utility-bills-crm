import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getServiceDetail } from "../_data/queries";
import { EditServiceFormContent } from "@/features/services";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function EditServicePage({ params }: TProps) {
  const { id, sid } = await params;

  const [propertyResult, serviceResult] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getServiceDetail(sid as TServiceId),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === "viewer") notFound();

  const property = propertyResult.value;
  const { service, serviceType } = serviceResult.value;

  return (
    <PageContainer
      title="Edit notes"
      breadcrumbs={[
        { label: "Properties", href: ROUTES.properties },
        { label: property.name, href: `/properties/${id}` },
        { label: serviceType.code, href: `/properties/${id}/services/${sid}` },
        { label: "Edit notes" },
      ]}
    >
      <div className="max-w-2xl">
        <EditServiceFormContent serviceId={service.id} initialNotes={service.notes ?? null} />
      </div>
    </PageContainer>
  );
}
