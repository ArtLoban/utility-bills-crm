import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getMeterDetail } from "../_data/queries";
import { ReplaceMeterFormContent } from "@/features/meters";
import { resolveServiceTypeLabelServer } from "@/features/services/service-label.server";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export default async function ReplaceMeterPage({ params }: TProps) {
  const { id, mid } = await params;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult, t, tNav] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
    getTranslations("meters.replaceForm"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { meter, serviceType } = meterResult.value;
  if (meter.propertyId !== id) notFound();

  const title = t("title");
  const serviceName = await resolveServiceTypeLabelServer(serviceType);

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: tNav("properties"), href: ROUTES.properties },
        { label: propertyResult.value.name, href: `${ROUTES.properties}/${id}` },
        { label: serviceName, href: `${ROUTES.properties}/${id}/meters/${mid}` },
        { label: title },
      ]}
      meta={<span className="text-muted-foreground text-sm">{t("meta")}</span>}
    >
      <ReplaceMeterFormContent meter={meter} supportsZones={serviceType.supportsZones} />
    </PageContainer>
  );
}
