import { notFound } from "next/navigation";

import { getServiceDetail } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { ReminderModal } from "@/features/notifications";
import type { TServiceId } from "@/lib/db/schema/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string; sid: string }>;
};

export default async function InterceptedNewReminderPage({ params }: TProps) {
  const { sid } = await params;
  const result = await getServiceDetail(sid as TServiceId);

  if (!result.ok || result.value.role === PROPERTY_ROLES.VIEWER) notFound();

  return <ReminderModal serviceId={sid as TServiceId} />;
}
