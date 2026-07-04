import { type ElementType } from "react";

import { CreditCard, Gauge, Home, Plug, Receipt, UserPlus } from "lucide-react";

import { ACTIVITY_KINDS, type TActivityKind } from "@/features/admin-dashboard";
import { SERVICE_TYPE_CODES, type TServiceTypeCode } from "@/features/services/service-type";

type TActivityKindVisuals = {
  icon: ElementType;
  color: string;
};

export const ACTIVITY_KIND_VISUALS: Record<TActivityKind, TActivityKindVisuals> = {
  [ACTIVITY_KINDS.PROPERTY]: { icon: Home, color: "var(--muted-foreground)" },
  [ACTIVITY_KINDS.USER]: { icon: UserPlus, color: "var(--primary)" },
  [ACTIVITY_KINDS.SERVICE]: { icon: Plug, color: "var(--info)" },
  [ACTIVITY_KINDS.BILL]: { icon: Receipt, color: "var(--info)" },
  [ACTIVITY_KINDS.PAYMENT]: { icon: CreditCard, color: "var(--success)" },
  [ACTIVITY_KINDS.READING]: { icon: Gauge, color: "var(--warning)" },
};

export const SERVICE_TYPE_LABELS: Record<TServiceTypeCode, string> = {
  [SERVICE_TYPE_CODES.ELECTRICITY]: "Electricity",
  [SERVICE_TYPE_CODES.GAS]: "Gas",
  [SERVICE_TYPE_CODES.GAS_DELIVERY]: "Gas delivery",
  [SERVICE_TYPE_CODES.COLD_WATER]: "Cold water",
  [SERVICE_TYPE_CODES.HOT_WATER]: "Hot water",
  [SERVICE_TYPE_CODES.HEATING]: "Heating",
  [SERVICE_TYPE_CODES.BUILDING_MAINTENANCE]: "Building maintenance",
  [SERVICE_TYPE_CODES.GARBAGE_COLLECTION]: "Garbage collection",
  [SERVICE_TYPE_CODES.INTERNET]: "Internet",
  [SERVICE_TYPE_CODES.INTERCOM]: "Intercom",
  [SERVICE_TYPE_CODES.HOA_FEES]: "HOA fees",
  [SERVICE_TYPE_CODES.OTHER]: "Other",
};
