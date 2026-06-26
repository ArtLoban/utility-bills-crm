import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import {
  getMeterDetail,
  getPreviousReading,
  getReading,
} from "@/app/(app)/properties/[id]/meters/[mid]/_data/queries";
import { ReadingModal } from "@/features/readings";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";
import type { ReadingId } from "@/lib/db/schema/readings";

type TProps = {
  params: Promise<{ id: string; mid: string; rid: string }>;
};

export default async function InterceptedEditReadingPage({ params }: TProps) {
  const { id, mid, rid } = await params;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult, readingResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
    getReading(rid as ReadingId),
  ]);

  if (!propertyResult.ok || !meterResult.ok || !readingResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { meter, serviceType } = meterResult.value;
  if (meter.propertyId !== id) notFound();

  const reading = readingResult.value;
  if (reading.meterId !== meterId) notFound();

  const lastReading = await getPreviousReading(meterId, new Date(reading.readAt));

  return (
    <ReadingModal
      meter={meter}
      serviceType={serviceType}
      propertyName={propertyResult.value.name}
      lastReading={lastReading.ok ? lastReading.value : null}
      reading={reading}
    />
  );
}
