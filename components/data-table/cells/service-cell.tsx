import { useTranslations } from "next-intl";
import {
  Building2,
  Droplets,
  Flame,
  Globe,
  Phone,
  Thermometer,
  Trash2,
  Truck,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

const SERVICE_ICONS: Record<TServiceTypeCode, LucideIcon> = {
  electricity: Zap,
  gas: Flame,
  gas_delivery: Truck,
  cold_water: Droplets,
  hot_water: Droplets,
  heating: Thermometer,
  building_maintenance: Building2,
  garbage_collection: Trash2,
  internet: Globe,
  intercom: Phone,
  hoa_fees: Wallet,
};

type TProps = {
  type: TServiceTypeCode;
  /** Show the localized label next to the icon. Default: true. */
  showLabel?: boolean;
  className?: string;
};

// TODO: fix t.has(type) ? t(type) : type
export const ServiceCell = ({ type, showLabel = true, className }: TProps) => {
  const t = useTranslations("services.types");
  const Icon = SERVICE_ICONS[type] || null;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={t.has(type) ? t(type) : type}
    >
      {Icon && <Icon size={16} className="text-muted-foreground shrink-0" aria-hidden />}
      {showLabel && <span>{t.has(type) ? t(type) : type}</span>}
    </span>
  );
};
