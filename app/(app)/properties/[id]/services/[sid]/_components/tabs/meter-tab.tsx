import { getCurrentMeterForService, getLastReadingForMeter } from "../../_data/queries";
import { MeterCard } from "../meter-card";
import { SubmitReadingButton } from "../submit-reading-button";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceType: TServiceType;
  canEdit: boolean;
};

export const MeterTab = async ({ serviceId, propertyId, serviceType, canEdit }: TProps) => {
  const currentMeter = await getCurrentMeterForService(serviceId);
  const lastReading = currentMeter ? await getLastReadingForMeter(currentMeter) : null;

  return (
    <MeterCard
      meter={currentMeter}
      propertyId={propertyId}
      serviceType={serviceType}
      lastReading={lastReading}
      action={currentMeter && canEdit ? <SubmitReadingButton meter={currentMeter} /> : undefined}
    />
  );
};
