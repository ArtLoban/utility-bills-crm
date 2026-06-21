import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import { SERVICE_TAB_PARAM, type TServiceTab } from "./constants";
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
    <nav className="border-border mb-6 flex items-center border-b">
      {tabs.map(({ key, Icon }) => {
        const isActive = key === activeTab;

        return (
          <Link
            key={key}
            href={`${basePath}?${SERVICE_TAB_PARAM}=${key}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative mr-6 inline-flex items-center gap-1.5 px-1 py-2.5 text-sm no-underline transition-colors",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground font-medium",
            )}
          >
            <Icon className={cn("size-4", isActive && "text-primary")} />
            {t(key)}
            {isActive && (
              <span className="bg-primary absolute inset-x-0 -bottom-px h-0.5 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
