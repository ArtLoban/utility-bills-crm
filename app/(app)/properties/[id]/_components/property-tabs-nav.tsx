import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "meters", label: "Meters" },
  { key: "sharing", label: "Sharing" },
] as const;

type TProps = {
  propertyId: string;
  activeTab: string;
};

const PropertyTabsNav = ({ propertyId, activeTab }: TProps) => {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-[3px] dark:border-zinc-700 dark:bg-zinc-800"
      style={{ marginBottom: 20 }}
    >
      {TABS.map(({ key, label }) => {
        const isActive = key === activeTab;
        return (
          <Link
            key={key}
            href={`/properties/${propertyId}?tab=${key}`}
            className={cn(
              "rounded-[5px] px-3.5 py-1.5 transition-colors duration-[120ms]",
              isActive
                ? "bg-white font-medium text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-zinc-900 dark:text-zinc-50"
                : "font-normal text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
            )}
            style={{ fontSize: 13, textDecoration: "none" }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export { PropertyTabsNav };
