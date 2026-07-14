import { notFound } from "next/navigation";

import {
  getCurrentMeterForService,
  getServiceDetail,
} from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { UpdateContractModal } from "@/features/contracts";
import { rateZoneCountFor } from "@/features/tariffs/rate-zone-count";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedUpdateContractPage({ params }: TProps) {
  const { id, sid } = await params;
  const serviceId = sid as TServiceId;

  const [serviceResult, meter] = await Promise.all([
    getServiceDetail(serviceId),
    getCurrentMeterForService(serviceId),
  ]);

  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { serviceType, currentContract } = serviceResult.value;
  if (!currentContract) notFound();

  const zoneCount = rateZoneCountFor(serviceType, meter);

  return (
    <UpdateContractModal
      contractId={currentContract.contract.id}
      serviceId={serviceId}
      serviceType={serviceType}
      zoneCount={zoneCount}
      propertyId={id}
    />
  );
}
