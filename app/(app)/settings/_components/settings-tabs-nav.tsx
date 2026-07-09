import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/routes";
import { TabNav } from "@/components/tab-nav";
import { TabNavItem } from "@/components/tab-nav/tab-nav-item";
import { tabNavItemClass } from "@/components/tab-nav/utils";
import { TAB_PARAM } from "@/components/tab-nav/constants";
import { SETTINGS_TAB_CONFIG, type TSettingsTab } from "./constants";

type TProps = {
  activeTab: TSettingsTab;
};

export const SettingsTabsNav = async ({ activeTab }: TProps) => {
  const t = await getTranslations("settings.tabs");

  return (
    <TabNav className="mb-6">
      {SETTINGS_TAB_CONFIG.map(({ key, Icon }) => {
        const isActive = key === activeTab;

        return (
          <Link
            key={key}
            href={`${ROUTES.settings}?${TAB_PARAM}=${key}`}
            aria-current={isActive ? "page" : undefined}
            className={tabNavItemClass(isActive)}
          >
            <TabNavItem icon={Icon} label={t(key)} isActive={isActive} />
          </Link>
        );
      })}
    </TabNav>
  );
};
