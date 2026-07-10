import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

export const rateZoneCountFor = (
  serviceType: Pick<TServiceType, "measurementType" | "supportsZones">,
  meter: Pick<TMeter, "zoneCount"> | null,
): number =>
  serviceType.measurementType === "metered" && serviceType.supportsZones && meter
    ? meter.zoneCount
    : 1;
