import { Building2, CreditCard, FileText, Gauge, Home, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const NAV_ICONS: Record<string, LucideIcon> = {
  [ROUTES.dashboard]: LayoutDashboard,
  [ROUTES.properties]: Home,
  [ROUTES.providers]: Building2,
  [ROUTES.meters]: Gauge,
  [ROUTES.bills]: FileText,
  [ROUTES.payments]: CreditCard,
};
