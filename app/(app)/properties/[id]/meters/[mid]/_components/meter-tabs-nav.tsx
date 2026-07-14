import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/routes";
import { TabNav } from "@/components/tab-nav";
import { TabNavItem } from "@/components/tab-nav/tab-nav-item";
import { tabNavItemClass } from "@/components/tab-nav/utils";
import { TAB_PARAM } from "@/components/tab-nav/constants";
import type { MeterId } from "@/lib/db/schema/meters";
import { METER_TAB_CONFIG, type TMeterTab } from "./constants";

type TProps = {
  propertyId: string;
  meterId: MeterId;
  activeTab: TMeterTab;
};

export const MeterTabsNav = async ({ propertyId, meterId, activeTab }: TProps) => {
  const t = await getTranslations("meters.detail.tabs");
  const basePath = `${ROUTES.properties}/${propertyId}/meters/${meterId}`;

  return (
    <TabNav className="mb-6">
      {METER_TAB_CONFIG.map(({ key, Icon }) => {
        const isActive = key === activeTab;

        return (
          <Link
            key={key}
            href={`${basePath}?${TAB_PARAM}=${key}`}
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
