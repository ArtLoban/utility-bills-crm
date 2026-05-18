import { useTranslations } from "next-intl";
import {
  Droplets,
  Flame,
  Home,
  Phone,
  Thermometer,
  Trash2,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Mirrors the `service_types` catalog seeded in the DB.
 * Keep in sync with `lib/db/seed/service-types.ts` (TBD in scaffolding).
 */
export type TServiceType =
  | "electricity"
  | "gas"
  | "gas_delivery"
  | "cold_water"
  | "hot_water"
  | "heating"
  | "building_maintenance"
  | "garbage"
  | "internet"
  | "intercom"
  | "hoa";

const SERVICE_ICONS: Record<TServiceType, LucideIcon> = {
  electricity: Zap,
  gas: Flame,
  gas_delivery: Flame,
  cold_water: Droplets,
  hot_water: Droplets,
  heating: Thermometer,
  building_maintenance: Home,
  garbage: Trash2,
  internet: Wifi,
  intercom: Phone,
  hoa: Home,
};

type TProps = {
  type: TServiceType;
  /** Show the localized label next to the icon. Default: true. */
  showLabel?: boolean;
  className?: string;
};

export const ServiceCell = ({ type, showLabel = true, className }: TProps) => {
  const t = useTranslations("services.types");
  const Icon = SERVICE_ICONS[type];

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={t(type)}>
      <Icon size={16} className="text-muted-foreground shrink-0" aria-hidden />
      {showLabel && <span>{t(type)}</span>}
    </span>
  );
};
