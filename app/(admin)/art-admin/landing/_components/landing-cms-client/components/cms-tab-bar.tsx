"use client";

import { cn } from "@/lib/utils";

import { TAB_LABELS } from "../constants";
import type { TCmsTab } from "../types";

type TProps = {
  active: TCmsTab;
  onChange: (tab: TCmsTab) => void;
  dirtyTabs: TCmsTab[];
};

const TABS: TCmsTab[] = ["home", "about", "project", "global"];

export const CmsTabBar = ({ active, onChange, dirtyTabs }: TProps) => (
  <div className="border-border bg-muted inline-flex rounded-lg border p-[3px]">
    {TABS.map((tab) => {
      const isActive = tab === active;
      const isDirty = dirtyTabs.includes(tab);
      return (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-[7px] rounded-[6px] px-3.5 py-1.5 text-[13.5px] transition-colors duration-[120ms]",
            isActive
              ? "bg-background text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground bg-transparent font-medium",
          )}
          style={isActive ? { boxShadow: "0 1px 2px rgba(9,9,11,0.06)" } : undefined}
        >
          {TAB_LABELS[tab]}
          {isDirty && (
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-primary" : "bg-muted-foreground",
              )}
            />
          )}
        </button>
      );
    })}
  </div>
);
