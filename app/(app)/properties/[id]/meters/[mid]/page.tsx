import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import { getMeterDetail, getMeterReadings, getMostRecentReading } from "./_data/queries";
import { ConsumptionChart } from "./_components/consumption-chart";
import { DetailsCard } from "./_components/details-card";
import { MeterPageHeader } from "./_components/meter-page-header";
import { ReadingsSection } from "./_components/readings-section";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export const metadata: Metadata = {
  title: "Meter",
};

const SectionHeading = ({ children }: { children: string }) => (
  <div style={{ marginBottom: 12 }}>
    <h2
      className="text-zinc-950 dark:text-zinc-50"
      style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}
    >
      {children}
    </h2>
  </div>
);

export default async function MeterPage({ params }: TProps) {
  const { id, mid } = await params;

  const [propertyResult, meterResult] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getMeterDetail(mid as MeterId),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();

  const property = propertyResult.value;
  const { meter, serviceType } = meterResult.value;

  // Verify the meter belongs to the requested property.
  if (meter.propertyId !== id) notFound();

  const [readingsResult, lastReadingResult] = await Promise.all([
    getMeterReadings(mid as MeterId),
    getMostRecentReading(mid as MeterId),
  ]);

  const readings = readingsResult.ok ? readingsResult.value : [];
  const lastReading = lastReadingResult.ok ? lastReadingResult.value : null;

  const canMutate = property.role !== "viewer";

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px 80px", width: "100%" }}>
      <MeterPageHeader
        meter={meter}
        serviceType={serviceType}
        propertyId={id}
        propertyName={property.name}
        canMutate={canMutate}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <SectionHeading>Details</SectionHeading>
          <DetailsCard meter={meter} serviceType={serviceType} propertyName={property.name} />
        </div>

        <ReadingsSection
          meter={meter}
          serviceType={serviceType}
          propertyName={property.name}
          readings={readings}
          lastReading={lastReading}
          role={property.role}
        />

        <div>
          <SectionHeading>Consumption</SectionHeading>
          <ConsumptionChart readings={readings} meter={meter} serviceType={serviceType} />
        </div>
      </div>
    </div>
  );
}
