import { LayoutGrid, ListOrdered, type LucideIcon } from "lucide-react";

export const METER_TABS = {
  OVERVIEW: "overview",
  READINGS: "readings",
} as const;

export type TMeterTab = (typeof METER_TABS)[keyof typeof METER_TABS];

export type TMeterTabConfig = {
  key: TMeterTab;
  Icon: LucideIcon;
};

export const METER_TAB_CONFIG: TMeterTabConfig[] = [
  { key: METER_TABS.OVERVIEW, Icon: LayoutGrid },
  { key: METER_TABS.READINGS, Icon: ListOrdered },
];
