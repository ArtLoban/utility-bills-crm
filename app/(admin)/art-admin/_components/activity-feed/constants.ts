import { type ElementType } from "react";

import { CreditCard, Gauge, Home, Plug, Receipt, UserPlus } from "lucide-react";

import { ACTIVITY_KINDS, type TActivityKind } from "@/features/admin-dashboard";

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
