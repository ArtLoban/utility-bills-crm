import { notFound } from "next/navigation";

import {
  getRemindersForService,
  getServiceDetail,
} from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { ReminderModal } from "@/features/notifications";
import type { TServiceId } from "@/lib/db/schema/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string; sid: string; rid: string }>;
};

export default async function InterceptedEditReminderPage({ params }: TProps) {
  const { sid, rid } = await params;
  const result = await getServiceDetail(sid as TServiceId);

  if (!result.ok || result.value.role === PROPERTY_ROLES.VIEWER) notFound();

  const reminder = (await getRemindersForService(sid as TServiceId)).find(
    (item) => item.id === rid,
  );
  if (!reminder) notFound();

  return <ReminderModal serviceId={sid as TServiceId} reminder={reminder} />;
}
