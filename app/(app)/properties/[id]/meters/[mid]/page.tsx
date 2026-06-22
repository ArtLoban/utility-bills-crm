import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import { PageShell } from "@/components/page-shell";
import { getMeterDetail, getMeterReadings, getMostRecentReading } from "./_data/queries";
import { ConsumptionChart } from "./_components/consumption-chart";
import { DetailsCard } from "./_components/details-card";
import { MeterPageHeader } from "./_components/meter-page-header";
import { ReadingsSection } from "./_components/readings-section";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { mid } = await params;
  const result = await getMeterDetail(mid as MeterId);
  if (!result.ok) return {};

  const [tTypes, t] = await Promise.all([
    getTranslations("services.types"),
    getTranslations("meters.detail"),
  ]);
  const type = tTypes(result.value.serviceType.code as Parameters<typeof tTypes>[0]);

  return { title: t("title", { type }) };
}

export default async function MeterPage({ params }: TProps) {
  const { id, mid } = await params;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();

  const property = propertyResult.value;
  const { meter, serviceType } = meterResult.value;

  // Verify the meter belongs to the requested property.
  if (meter.propertyId !== id) notFound();

  const [readingsResult, lastReadingResult] = await Promise.all([
    getMeterReadings(meterId),
    getMostRecentReading(meterId),
  ]);

  const readings = readingsResult.ok ? readingsResult.value : [];
  const lastReading = lastReadingResult.ok ? lastReadingResult.value : null;

  const canMutate = property.role !== PROPERTY_ROLES.VIEWER;

  return (
    <PageShell>
      <MeterPageHeader
        meter={meter}
        serviceType={serviceType}
        propertyId={id}
        propertyName={property.name}
        canMutate={canMutate}
      />

      <div className="flex flex-col gap-6">
        <DetailsCard meter={meter} serviceType={serviceType} propertyName={property.name} />

        <ReadingsSection
          meter={meter}
          serviceType={serviceType}
          propertyName={property.name}
          readings={readings}
          lastReading={lastReading}
          role={property.role}
        />

        <ConsumptionChart readings={readings} meter={meter} serviceType={serviceType} />
      </div>
    </PageShell>
  );
}
