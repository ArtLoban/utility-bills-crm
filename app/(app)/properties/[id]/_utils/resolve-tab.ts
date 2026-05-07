import { TABS, type TTab } from "../_components/constants";

export const resolveTab = (tabValue?: string): TTab => {
  return Object.values(TABS).find((tab): tab is TTab => tab === tabValue) ?? TABS.OVERVIEW;
};
