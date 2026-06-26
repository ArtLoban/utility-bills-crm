import type { TMeter } from "@/lib/db/schema/meters";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getMeterReadings } from "../../_data/queries";
import { ReadingsSection } from "../readings-section";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  role: TPropertyRole;
};

export const ReadingsTab = async ({ meter, serviceType, role }: TProps) => {
  const readingsResult = await getMeterReadings(meter.id);

  const readings = readingsResult.ok ? readingsResult.value : [];

  return (
    <ReadingsSection meter={meter} serviceType={serviceType} readings={readings} role={role} />
  );
};
