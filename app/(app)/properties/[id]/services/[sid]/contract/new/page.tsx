import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getServiceDetail, getProvidersForContractPage } from "../../_data/queries";
import { CreateContractFormContent } from "@/features/contracts";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function NewContractPage({ params }: TProps) {
  const { id, sid } = await params;
  const propertyId = id as PropertyId;
  const serviceId = sid as TServiceId;

  const [propertyResult, serviceResult, providers, t, tNav, tTypes] = await Promise.all([
    getPropertyDetail(propertyId),
    getServiceDetail(serviceId),
    getProvidersForContractPage(),
    getTranslations("contracts"),
    getTranslations("nav"),
    getTranslations("services.types"),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { serviceType } = serviceResult.value;
  const serviceName = tTypes(serviceType.code as Parameters<typeof tTypes>[0]);
  const title = t("modal.add.title");

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: propertyResult.value.name, href: `${ROUTES.properties}/${id}` },
        { label: serviceName, href: `${ROUTES.properties}/${id}/services/${sid}` },
        { label: title },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("page.addMeta")}</span>}
    >
      <CreateContractFormContent
        propertyId={propertyId}
        serviceId={serviceId}
        providers={providers}
      />
    </PageContainer>
  );
}
