import { SETTINGS_TABS, SETTINGS_TAB_CONFIG, type TSettingsTab } from "../constants";

export const resolveSettingsTab = (tabValue: string | undefined): TSettingsTab =>
  SETTINGS_TAB_CONFIG.find((tab) => tab.key === tabValue)?.key ?? SETTINGS_TABS.PROFILE;
