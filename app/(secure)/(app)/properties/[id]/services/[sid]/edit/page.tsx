import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getServiceDetail } from "../_data/queries";
import { EditServiceFormContent } from "@/features/services";
import { resolveServiceLabelServer } from "@/features/services/service-label.server";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function EditServicePage({ params }: TProps) {
  const { id, sid } = await params;

  const [propertyResult, serviceResult, t, tNav] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getServiceDetail(sid as TServiceId),
    getTranslations("services.editService"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok) notFound();
  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const property = propertyResult.value;
  const { service, serviceType } = serviceResult.value;
  const serviceName = await resolveServiceLabelServer(service, serviceType);

  return (
    <PageContainer
      title={t("title")}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        { label: serviceName, href: `${ROUTES.properties}/${id}/services/${sid}` },
        { label: t("title") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("meta")}</span>}
    >
      <EditServiceFormContent
        propertyId={property.id}
        serviceId={service.id}
        initialName={service.name}
        initialNotes={service.notes}
        serviceTypeCode={serviceType.code as TServiceTypeCode}
      />
    </PageContainer>
  );
}
