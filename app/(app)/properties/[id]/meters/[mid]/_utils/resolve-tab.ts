import { METER_TABS, METER_TAB_CONFIG, type TMeterTab } from "../_components/constants";

export const resolveMeterTab = (tabValue: string | undefined): TMeterTab =>
  METER_TAB_CONFIG.find((tab) => tab.key === tabValue)?.key ?? METER_TABS.OVERVIEW;
