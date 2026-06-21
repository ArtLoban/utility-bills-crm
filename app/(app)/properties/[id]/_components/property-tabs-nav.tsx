import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/routes";
import { TabNav } from "@/components/tab-nav";
import { TabNavItem } from "@/components/tab-nav/tab-nav-item";
import { tabNavItemClass } from "@/components/tab-nav/utils";
import { TAB_PARAM } from "@/components/tab-nav/constants";
import { TAB_CONFIG, type TTab } from "./constants";

type TProps = {
  propertyId: string;
  activeTab: TTab;
};

export const PropertyTabsNav = async ({ propertyId, activeTab }: TProps) => {
  const t = await getTranslations("properties.detail.tabs");

  return (
    <TabNav className="mb-5">
      {TAB_CONFIG.map(({ key, Icon }) => {
        const isActive = key === activeTab;

        return (
          <Link
            key={key}
            href={`${ROUTES.properties}/${propertyId}?${TAB_PARAM}=${key}`}
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
