export const TABS = {
  OVERVIEW: "overview",
  METERS: "meters",
  SHARING: "sharing",
} as const;

export type TTab = (typeof TABS)[keyof typeof TABS];

export const TAB_CONFIG = [
  { key: TABS.OVERVIEW, label: "Overview" },
  { key: TABS.METERS, label: "Meters" },
  { key: TABS.SHARING, label: "Sharing" },
] as const;

export const TAB_PARAM = "tab";
