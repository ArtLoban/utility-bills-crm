import { PROPERTY_ROLES, type TPropertyRole } from "@/lib/db/schema/properties";
import {
  SERVICE_TABS,
  SERVICE_TAB_CONFIG,
  type TServiceTab,
  type TServiceTabConfig,
} from "../_components/constants";

const isTabVisible = (tab: TServiceTabConfig, role: TPropertyRole): boolean =>
  !tab.editorOnly || role !== PROPERTY_ROLES.VIEWER;

export const visibleServiceTabs = (role: TPropertyRole): TServiceTabConfig[] =>
  SERVICE_TAB_CONFIG.filter((tab) => isTabVisible(tab, role));

export const resolveServiceTab = (
  tabValue: string | undefined,
  role: TPropertyRole,
): TServiceTab => {
  const match = SERVICE_TAB_CONFIG.find((tab) => tab.key === tabValue && isTabVisible(tab, role));

  return match?.key ?? SERVICE_TABS.OVERVIEW;
};
