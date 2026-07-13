import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getAvailableServiceTypesForMeter, getEligibleServicesForMeter } from "../_data/queries";
import { AddMeterFormContent } from "@/features/meters";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function AddMeterPage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, availableServiceTypes, eligibleServices, t, tNav] = await Promise.all([
    getPropertyDetail(propertyId),
    getAvailableServiceTypesForMeter(propertyId),
    getEligibleServicesForMeter(propertyId),
    getTranslations("meters.addForm"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const title = t("title");

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: propertyResult.value.name, href: `${ROUTES.properties}/${id}?tab=meters` },
        { label: title },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("description")}</span>}
    >
      <AddMeterFormContent
        propertyId={id}
        availableServiceTypes={availableServiceTypes}
        eligibleServices={eligibleServices}
      />
    </PageContainer>
  );
}
