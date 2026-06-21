import { RemindersSection } from "@/features/notifications";
import type { TServiceId } from "@/lib/db/schema/services";
import { getRemindersForService, getTelegramLinked } from "../../_data/queries";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
};

export const RemindersTab = async ({ serviceId, propertyId }: TProps) => {
  const [reminders, isTelegramLinked] = await Promise.all([
    getRemindersForService(serviceId),
    getTelegramLinked(),
  ]);

  return (
    <RemindersSection
      reminders={reminders}
      isTelegramLinked={isTelegramLinked}
      propertyId={propertyId}
      serviceId={serviceId}
    />
  );
};
