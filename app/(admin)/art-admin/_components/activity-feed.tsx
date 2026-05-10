import { type ElementType } from "react";

import { Home, KeyRound, Receipt, Trash2, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { DataCard } from "@/components/data-card";
import { IconBadge } from "@/components/icon-badge";

type TActivityRow = {
  icon: ElementType;
  iconColor: string;
  bold: string;
  body: string;
  timestamp: string;
};

const MOCK_ACTIVITY_ROWS: TActivityRow[] = [
  {
    icon: UserPlus,
    iconColor: "#7c3aed",
    bold: "New user joined",
    body: "alex.kovalenko@example.com signed in with Google",
    timestamp: "12 minutes ago",
  },
  {
    icon: Receipt,
    iconColor: "#0284c7",
    bold: "Bill recorded",
    body: "Art Loban recorded electricity bill for Main apartment",
    timestamp: "47 minutes ago",
  },
  {
    icon: Home,
    iconColor: "#71717a",
    bold: "Property created",
    body: 'Olena Petrenko added "Sea-view condo"',
    timestamp: "1 hour ago",
  },
  {
    icon: KeyRound,
    iconColor: "#d97706",
    bold: "Sharing changed",
    body: 'Art Loban added Olena Loban as editor on "Family home"',
    timestamp: "3 hours ago",
  },
  {
    icon: Trash2,
    iconColor: "#dc2626",
    bold: "Property soft-deleted",
    body: 'Mykhailo Tkachenko removed "Old apartment"',
    timestamp: "2 days ago",
  },
  {
    icon: Receipt,
    iconColor: "#0284c7",
    bold: "Bill recorded",
    body: "Mykhailo Tkachenko recorded gas bill for Forest cabin",
    timestamp: "3 days ago",
  },
  {
    icon: Home,
    iconColor: "#71717a",
    bold: "Property created",
    body: 'Iryna Shevchenko added "Shared family home"',
    timestamp: "1 week ago",
  },
];

export const ActivityFeed = () => {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-2.5">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <span className="text-muted-foreground text-xs">Last 20 actions across the system.</span>
      </div>
      <DataCard className="overflow-hidden">
        {MOCK_ACTIVITY_ROWS.map((row, i) => {
          const Icon = row.icon;
          const isLast = i === MOCK_ACTIVITY_ROWS.length - 1;
          return (
            <div
              key={i}
              className={cn(
                "hover:bg-muted/50 flex items-center gap-3.5 px-6 py-3.5 transition-colors duration-150",
                !isLast && "border-b",
              )}
            >
              <IconBadge icon={Icon} color={row.iconColor} size="sm" />
              <p className="flex-1 text-sm leading-snug">
                <span className="font-medium">{row.bold}</span>
                <span className="text-muted-foreground"> — {row.body}</span>
              </p>
              <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                {row.timestamp}
              </span>
            </div>
          );
        })}
      </DataCard>
    </section>
  );
};
