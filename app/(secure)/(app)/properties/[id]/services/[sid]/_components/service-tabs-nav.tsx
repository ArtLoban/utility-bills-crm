import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/routes";
import { TabNav } from "@/components/tab-nav";
import { TabNavItem } from "@/components/tab-nav/tab-nav-item";
import { tabNavItemClass } from "@/components/tab-nav/utils";
import { TAB_PARAM } from "@/components/tab-nav/constants";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import { type TServiceTab } from "./constants";
import { visibleServiceTabs } from "../_utils/resolve-tab";

type TProps = {
  propertyId: string;
  serviceId: TServiceId;
  activeTab: TServiceTab;
  role: TPropertyRole;
};

export const ServiceTabsNav = async ({ propertyId, serviceId, activeTab, role }: TProps) => {
  const t = await getTranslations("services.detail.tabs");
  const tabs = visibleServiceTabs(role);
  const basePath = `${ROUTES.properties}/${propertyId}/services/${serviceId}`;

  return (
    <TabNav className="mb-6">
      {tabs.map(({ key, Icon }) => {
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
