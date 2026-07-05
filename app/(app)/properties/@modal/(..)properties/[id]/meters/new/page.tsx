import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import {
  getAvailableServiceTypesForMeter,
  getEligibleServicesForMeter,
} from "@/app/(app)/properties/[id]/meters/_data/queries";
import { AddMeterModal } from "@/features/meters";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedAddMeterPage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, availableServiceTypes, eligibleServices] = await Promise.all([
    getPropertyDetail(propertyId),
    getAvailableServiceTypesForMeter(propertyId),
    getEligibleServicesForMeter(propertyId),
  ]);

  if (!propertyResult.ok) notFound();
  if (propertyResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  return (
    <AddMeterModal
      propertyId={id}
      availableServiceTypes={availableServiceTypes}
      eligibleServices={eligibleServices}
    />
  );
}
