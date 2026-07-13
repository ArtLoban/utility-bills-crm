import { Bell, ShieldCheck, SlidersHorizontal, User, type LucideIcon } from "lucide-react";

export const SETTINGS_TABS = {
  PROFILE: "profile",
  PREFERENCES: "preferences",
  NOTIFICATIONS: "notifications",
  ACCOUNT: "account",
} as const;

export type TSettingsTab = (typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS];

export type TSettingsTabConfig = {
  key: TSettingsTab;
  Icon: LucideIcon;
};

export const SETTINGS_TAB_CONFIG: TSettingsTabConfig[] = [
  { key: SETTINGS_TABS.PROFILE, Icon: User },
  { key: SETTINGS_TABS.PREFERENCES, Icon: SlidersHorizontal },
  { key: SETTINGS_TABS.NOTIFICATIONS, Icon: Bell },
  { key: SETTINGS_TABS.ACCOUNT, Icon: ShieldCheck },
];
