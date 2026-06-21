import { Bell, FileText, Gauge, LayoutGrid, type LucideIcon } from "lucide-react";

export const SERVICE_TABS = {
  OVERVIEW: "overview",
  CONTRACT: "contract",
  METER: "meter",
  REMINDERS: "reminders",
} as const;

export type TServiceTab = (typeof SERVICE_TABS)[keyof typeof SERVICE_TABS];

export const SERVICE_TAB_PARAM = "tab";

export type TServiceTabConfig = {
  key: TServiceTab;
  Icon: LucideIcon;
  editorOnly?: boolean;
};

export const SERVICE_TAB_CONFIG: TServiceTabConfig[] = [
  { key: SERVICE_TABS.OVERVIEW, Icon: LayoutGrid },
  { key: SERVICE_TABS.CONTRACT, Icon: FileText },
  { key: SERVICE_TABS.METER, Icon: Gauge },
  { key: SERVICE_TABS.REMINDERS, Icon: Bell, editorOnly: true },
];
