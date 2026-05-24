// Display constants keyed by DB service type codes (snake_case).
// Parallel to SERVICE_COLORS / SERVICE_ICONS (camelCase) which serve legacy mock consumers.
// Tech-debt: unify into a single system once all mock consumers migrate to real data.

import type { ElementType } from "react";
import {
  Building2,
  Droplets,
  Flame,
  Gauge,
  Globe,
  Phone,
  Plug,
  Thermometer,
  Trash2,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";

export const SERVICE_TYPE_COLORS: Record<string, string> = {
  electricity: "#f59e0b",
  gas: "#ef4444",
  cold_water: "#3b82f6",
  hot_water: "#ec4899",
  gas_delivery: "#f97316",
  heating: "#8b5cf6",
  building_maintenance: "#64748b",
  garbage_collection: "#6b7280",
  internet: "#14b8a6",
  intercom: "#0ea5e9",
  hoa_fees: "#84cc16",
};

export const SERVICE_TYPE_ICONS: Record<string, ElementType> = {
  electricity: Zap,
  gas: Flame,
  cold_water: Droplets,
  hot_water: Droplets,
  gas_delivery: Truck,
  heating: Thermometer,
  building_maintenance: Building2,
  garbage_collection: Trash2,
  internet: Globe,
  intercom: Phone,
  hoa_fees: Wallet,
};

const FALLBACK_COLOR = "#94a3b8";
const FALLBACK_ICON: ElementType = Plug;

export const getServiceTypeDisplay = (code: string): { color: string; Icon: ElementType } => ({
  color: SERVICE_TYPE_COLORS[code] ?? FALLBACK_COLOR,
  Icon: SERVICE_TYPE_ICONS[code] ?? FALLBACK_ICON,
});

// Convenience: measurement type indicator for UI decisions (show meter prompt, etc.)
// Mirrors the DB measurementType column without requiring a DB call.
export const METERED_SERVICE_CODES = new Set([
  "electricity",
  "gas",
  "cold_water",
  "hot_water",
] as const);
