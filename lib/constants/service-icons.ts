import type { ElementType } from "react";
import { Droplets, Flame, Thermometer, Wifi, Zap } from "lucide-react";

import type { TServiceKey } from "./service-colors";

export const SERVICE_ICONS: Record<TServiceKey, ElementType> = {
  electricity: Zap,
  gas: Flame,
  coldWater: Droplets,
  hotWater: Droplets,
  heating: Thermometer,
  internet: Wifi,
};
