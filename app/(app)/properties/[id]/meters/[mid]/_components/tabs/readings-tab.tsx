import type { TMeter } from "@/lib/db/schema/meters";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getMeterReadings, getMostRecentReading } from "../../_data/queries";
import { ReadingsSection } from "../readings-section";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  role: TPropertyRole;
};

export const ReadingsTab = async ({ meter, serviceType, propertyName, role }: TProps) => {
  const [readingsResult, lastReadingResult] = await Promise.all([
    getMeterReadings(meter.id),
    getMostRecentReading(meter.id),
  ]);

  const readings = readingsResult.ok ? readingsResult.value : [];
  const lastReading = lastReadingResult.ok ? lastReadingResult.value : null;

  return (
    <ReadingsSection
      meter={meter}
      serviceType={serviceType}
      propertyName={propertyName}
      readings={readings}
      lastReading={lastReading}
      role={role}
    />
  );
};
