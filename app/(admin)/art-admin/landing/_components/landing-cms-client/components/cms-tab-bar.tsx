"use client";

import { TabNav } from "@/components/tab-nav";
import { TabNavItem } from "@/components/tab-nav/tab-nav-item";
import { tabNavItemClass } from "@/components/tab-nav/utils";
import { cn } from "@/lib/utils";

import { CMS_TAB_VALUES, TAB_ICONS, TAB_LABELS, type TCmsTab } from "../constants";

type TProps = {
  active: TCmsTab;
  onChange: (tab: TCmsTab) => void;
  dirtyTabs: TCmsTab[];
};

export const CmsTabBar = ({ active, onChange, dirtyTabs }: TProps) => (
  <TabNav>
    {CMS_TAB_VALUES.map((tab) => {
      const isActive = tab === active;
      const isDirty = dirtyTabs.includes(tab);

      return (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(tabNavItemClass(isActive), "cursor-pointer")}
        >
          <TabNavItem icon={TAB_ICONS[tab]} label={TAB_LABELS[tab]} isActive={isActive}>
            {isDirty && (
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isActive ? "bg-primary" : "bg-muted-foreground",
                )}
              />
            )}
          </TabNavItem>
        </button>
      );
    })}
  </TabNav>
);
