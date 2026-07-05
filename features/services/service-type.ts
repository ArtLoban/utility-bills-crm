import {
  Building2,
  Droplets,
  Flame,
  Globe,
  Phone,
  Layers,
  Tags,
  Thermometer,
  Trash2,
  Truck,
  Wallet,
  Zap,
  LucideIcon,
} from "lucide-react";

export const SERVICE_TYPE_CODES = {
  ELECTRICITY: "electricity",
  GAS: "gas",
  COLD_WATER: "cold_water",
  HOT_WATER: "hot_water",
  GAS_DELIVERY: "gas_delivery",
  HEATING: "heating",
  BUILDING_MAINTENANCE: "building_maintenance",
  GARBAGE_COLLECTION: "garbage_collection",
  INTERNET: "internet",
  INTERCOM: "intercom",
  HOA_FEES: "hoa_fees",
  OTHER: "other",
} as const;

export type TServiceTypeCode = (typeof SERVICE_TYPE_CODES)[keyof typeof SERVICE_TYPE_CODES];

export type TServiceTypeVisuals = {
  color: string;
  Icon: LucideIcon;
};

export const SERVICE_TYPE_COLORS: Record<TServiceTypeCode, string> = {
  [SERVICE_TYPE_CODES.ELECTRICITY]: "var(--service-electricity)",
  [SERVICE_TYPE_CODES.GAS]: "var(--service-gas)",
  [SERVICE_TYPE_CODES.COLD_WATER]: "var(--service-cold-water)",
  [SERVICE_TYPE_CODES.HOT_WATER]: "var(--service-hot-water)",
  [SERVICE_TYPE_CODES.GAS_DELIVERY]: "var(--service-gas-delivery)",
  [SERVICE_TYPE_CODES.HEATING]: "var(--service-heating)",
  [SERVICE_TYPE_CODES.BUILDING_MAINTENANCE]: "var(--service-building-maintenance)",
  [SERVICE_TYPE_CODES.GARBAGE_COLLECTION]: "var(--service-garbage-collection)",
  [SERVICE_TYPE_CODES.INTERNET]: "var(--service-internet)",
  [SERVICE_TYPE_CODES.INTERCOM]: "var(--service-intercom)",
  [SERVICE_TYPE_CODES.HOA_FEES]: "var(--service-hoa-fees)",
  [SERVICE_TYPE_CODES.OTHER]: "var(--muted-foreground)",
};

export const SERVICE_TYPE_ICONS: Record<TServiceTypeCode, LucideIcon> = {
  [SERVICE_TYPE_CODES.ELECTRICITY]: Zap,
  [SERVICE_TYPE_CODES.GAS]: Flame,
  [SERVICE_TYPE_CODES.COLD_WATER]: Droplets,
  [SERVICE_TYPE_CODES.HOT_WATER]: Droplets,
  [SERVICE_TYPE_CODES.GAS_DELIVERY]: Truck,
  [SERVICE_TYPE_CODES.HEATING]: Thermometer,
  [SERVICE_TYPE_CODES.BUILDING_MAINTENANCE]: Building2,
  [SERVICE_TYPE_CODES.GARBAGE_COLLECTION]: Trash2,
  [SERVICE_TYPE_CODES.INTERNET]: Globe,
  [SERVICE_TYPE_CODES.INTERCOM]: Phone,
  [SERVICE_TYPE_CODES.HOA_FEES]: Wallet,
  [SERVICE_TYPE_CODES.OTHER]: Tags,
};

const FALLBACK_COLOR = "var(--muted-foreground)";
const FALLBACK_ICON: LucideIcon = Layers;

export const getServiceTypeVisuals = (code: TServiceTypeCode): TServiceTypeVisuals => ({
  color: SERVICE_TYPE_COLORS[code] ?? FALLBACK_COLOR,
  Icon: SERVICE_TYPE_ICONS[code] ?? FALLBACK_ICON,
});

export const METERED_SERVICE_CODES = new Set<TServiceTypeCode>([
  SERVICE_TYPE_CODES.ELECTRICITY,
  SERVICE_TYPE_CODES.GAS,
  SERVICE_TYPE_CODES.COLD_WATER,
  SERVICE_TYPE_CODES.HOT_WATER,
]);
