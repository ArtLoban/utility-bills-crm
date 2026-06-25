import { notFound } from "next/navigation";

import { getServiceDetail } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { EditServiceModal } from "@/features/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedEditServicePage({ params }: TProps) {
  const { sid } = await params;
  const result = await getServiceDetail(sid as TServiceId);

  if (!result.ok || result.value.role === PROPERTY_ROLES.VIEWER) notFound();

  return (
    <EditServiceModal serviceId={sid as TServiceId} initialNotes={result.value.service.notes} />
  );
}
