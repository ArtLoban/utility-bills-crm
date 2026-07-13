import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { getMeterDetail } from "@/app/(secure)/(app)/properties/[id]/meters/[mid]/_data/queries";
import { ReplaceMeterModal } from "@/features/meters";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export default async function InterceptedReplaceMeterPage({ params }: TProps) {
  const { id, mid } = await params;

  const [propertyResult, meterResult] = await Promise.all([
    getPropertyDetail(id as PropertyId),
    getMeterDetail(mid as MeterId),
  ]);

  if (!propertyResult.ok || !meterResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { meter, serviceType } = meterResult.value;
  if (meter.propertyId !== id) notFound();

  return <ReplaceMeterModal meter={meter} supportsZones={serviceType.supportsZones} />;
}
