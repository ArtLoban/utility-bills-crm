import { Building2, Home, LucideIcon, MapPin, Trees } from "lucide-react";
import { PROPERTY_TYPES, TPropertyType } from "@/lib/db/schema";

export const PROPERTY_TYPE_ICONS: Record<TPropertyType, LucideIcon> = {
  [PROPERTY_TYPES.APARTMENT]: Building2,
  [PROPERTY_TYPES.HOUSE]: Home,
  [PROPERTY_TYPES.COTTAGE]: Trees,
  [PROPERTY_TYPES.OTHER]: MapPin,
};

export const PROPERTY_TYPE_OPTIONS = [
  { value: PROPERTY_TYPES.APARTMENT, Icon: PROPERTY_TYPE_ICONS.apartment },
  { value: PROPERTY_TYPES.HOUSE, Icon: PROPERTY_TYPE_ICONS.house },
  { value: PROPERTY_TYPES.COTTAGE, Icon: PROPERTY_TYPE_ICONS.cottage },
  { value: PROPERTY_TYPES.OTHER, Icon: PROPERTY_TYPE_ICONS.other },
] as const;
