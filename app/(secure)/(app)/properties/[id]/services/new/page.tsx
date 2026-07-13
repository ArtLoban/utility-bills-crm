import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getAddServicePageData } from "./_data/queries";
import { AddServiceSetupForm } from "@/features/services";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
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

  if (!propertyResult.ok || propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();
  if (!dataResult.ok) notFound();

  const property = propertyResult.value;
  const [t, tNav] = await Promise.all([
    getTranslations("services.serviceForm"),
    getTranslations("nav"),
  ]);

  return (
    <PageContainer
      title={t("title")}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: property.name, href: `${ROUTES.properties}/${id}` },
        { label: t("breadcrumb") },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("meta")}</span>}
    >
      <AddServiceSetupForm
        propertyId={propertyId}
        serviceTypes={dataResult.value.allServiceTypes}
        existingTypeIds={dataResult.value.existingTypeIds}
        providers={dataResult.value.providers}
      />
    </PageContainer>
  );
}
