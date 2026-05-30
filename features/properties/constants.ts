import { Building2, Home, MapPin, Trees } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/db/schema/properties";

export const TYPE_OPTIONS = [
  { value: PROPERTY_TYPES.APARTMENT, Icon: Building2 },
  { value: PROPERTY_TYPES.HOUSE, Icon: Home },
  { value: PROPERTY_TYPES.COTTAGE, Icon: Trees },
  { value: PROPERTY_TYPES.OTHER, Icon: MapPin },
] as const;
