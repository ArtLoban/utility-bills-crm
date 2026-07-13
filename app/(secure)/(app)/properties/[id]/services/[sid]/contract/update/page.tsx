import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getCurrentMeterForService, getServiceDetail } from "../../_data/queries";
import { UpdateContractFormContent } from "@/features/contracts";
import { rateZoneCountFor } from "@/features/tariffs/rate-zone-count";
import { resolveServiceLabelServer } from "@/features/services/service-label.server";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function UpdateContractPage({ params }: TProps) {
  const { id, sid } = await params;
  const propertyId = id as PropertyId;
  const serviceId = sid as TServiceId;

  const [propertyResult, serviceResult, meter, t, tNav] = await Promise.all([
    getPropertyDetail(propertyId),
    getServiceDetail(serviceId),
    getCurrentMeterForService(serviceId),
    getTranslations("services.detail.updateContract"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { service, serviceType, currentContract } = serviceResult.value;
  if (!currentContract) notFound();

  const zoneCount = rateZoneCountFor(serviceType, meter);

  const serviceName = await resolveServiceLabelServer(service, serviceType);
  const title = t("title");

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: propertyResult.value.name, href: `${ROUTES.properties}/${id}` },
        { label: serviceName, href: `${ROUTES.properties}/${id}/services/${sid}` },
        { label: title },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.meta")}</span>}
    >
      <UpdateContractFormContent
        contractId={currentContract.contract.id}
        serviceId={serviceId}
        serviceType={serviceType}
        zoneCount={zoneCount}
        propertyId={propertyId}
      />
    </PageContainer>
  );
}
