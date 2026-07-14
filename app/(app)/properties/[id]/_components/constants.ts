import { Gauge, LayoutGrid, Users, type LucideIcon } from "lucide-react";

export const TABS = {
  OVERVIEW: "overview",
  METERS: "meters",
  SHARING: "sharing",
} as const;

export type TTab = (typeof TABS)[keyof typeof TABS];

export type TTabConfig = { key: TTab; Icon: LucideIcon };

export const TAB_CONFIG: TTabConfig[] = [
  { key: TABS.OVERVIEW, Icon: LayoutGrid },
  { key: TABS.METERS, Icon: Gauge },
  { key: TABS.SHARING, Icon: Users },
];
