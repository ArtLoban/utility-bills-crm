import { notFound } from "next/navigation";

import { getServiceDetail } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { UpdateContractModal } from "@/features/contracts";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedUpdateContractPage({ params }: TProps) {
  const { id, sid } = await params;
  const serviceId = sid as TServiceId;

  const serviceResult = await getServiceDetail(serviceId);

  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { serviceType, currentContract } = serviceResult.value;
  if (!currentContract) notFound();

  return (
    <UpdateContractModal
      contractId={currentContract.contract.id}
      serviceId={serviceId}
      serviceType={serviceType}
      propertyId={id}
    />
  );
}
