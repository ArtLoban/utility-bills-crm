import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import {
  getMeterDetail,
  getMostRecentReading,
} from "@/app/(secure)/(app)/properties/[id]/meters/[mid]/_data/queries";
import { ReadingModal } from "@/features/readings";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export default async function InterceptedNewReadingPage({ params }: TProps) {
  const { id, mid } = await params;
  const propertyId = id as PropertyId;
  const meterId = mid as MeterId;

  const [propertyResult, meterResult, lastReading] = await Promise.all([
    getPropertyDetail(propertyId),
    getMeterDetail(meterId),
    getMostRecentReading(meterId),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { meter, serviceType } = meterResult.value;
  if (meter.propertyId !== id) notFound();

  return (
    <ReadingModal
      meter={meter}
      serviceType={serviceType}
      propertyName={propertyResult.value.name}
      lastReading={lastReading.ok ? lastReading.value : null}
    />
  );
}
