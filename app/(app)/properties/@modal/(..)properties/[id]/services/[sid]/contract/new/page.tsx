import { notFound } from "next/navigation";

import {
  getServiceDetail,
  getProvidersForContractPage,
} from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { CreateContractModal } from "@/features/contracts";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedNewContractPage({ params }: TProps) {
  const { sid } = await params;
  const serviceId = sid as TServiceId;

  const [serviceResult, providers] = await Promise.all([
    getServiceDetail(serviceId),
    getProvidersForContractPage(),
  ]);

  if (!serviceResult.ok || serviceResult.value.role === "viewer") notFound();

  return <CreateContractModal serviceId={serviceId} providers={providers} />;
}
