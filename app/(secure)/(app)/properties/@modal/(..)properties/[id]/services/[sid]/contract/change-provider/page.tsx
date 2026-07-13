import { notFound } from "next/navigation";

import {
  getServiceDetail,
  getProvidersForContractPage,
} from "@/app/(secure)/(app)/properties/[id]/services/[sid]/_data/queries";
import { ChangeProviderModal } from "@/features/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedChangeProviderPage({ params }: TProps) {
  const { sid } = await params;
  const serviceId = sid as TServiceId;

  const [serviceResult, providers] = await Promise.all([
    getServiceDetail(serviceId),
    getProvidersForContractPage(),
  ]);

  if (!serviceResult.ok || serviceResult.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const { currentContract } = serviceResult.value;
  if (!currentContract) notFound();

  return (
    <ChangeProviderModal
      serviceId={serviceId}
      currentProviderId={currentContract.provider.id}
      providers={providers}
    />
  );
}
