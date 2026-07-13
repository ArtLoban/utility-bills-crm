import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getMeterDetail, getPreviousReading, getReading } from "../../../_data/queries";
import { ReadingFormContent } from "@/features/readings";
import { resolveServiceTypeLabelServer } from "@/features/services/service-label.server";
import { PageContainer } from "@/components/page-container";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import type { ReadingId } from "@/lib/db/schema/readings";

type TProps = {
  params: Promise<{ id: string; mid: string; rid: string }>;
};

export default async function EditReadingPage({ params }: TProps) {
  const { id, mid, rid } = await params;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult, readingResult, t, tNav] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
    getReading(rid as ReadingId),
    getTranslations("readings.form"),
    getTranslations("nav"),
  ]);

  if (!propertyResult.ok || !meterResult.ok || !readingResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { meter, serviceType } = meterResult.value;
  if (meter.propertyId !== id) notFound();

  const reading = readingResult.value;
  if (reading.meterId !== meterId) notFound();

  const lastReading = await getPreviousReading(meterId, new Date(reading.readAt));

  const title = t("title.edit");
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
      meta={<span className="text-muted-foreground text-sm">{t("meta.edit")}</span>}
    >
      <ReadingFormContent
        meter={meter}
        serviceType={serviceType}
        propertyName={propertyResult.value.name}
        lastReading={lastReading.ok ? lastReading.value : null}
        reading={reading}
      />
    </PageContainer>
  );
}
