import { type ElementType } from "react";

import { CreditCard, Gauge, Home, Plug, Receipt, UserPlus } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { DataCard } from "@/components/data-card";
import { IconBadge } from "@/components/icon-badge";
import type { TActivityItem, TActivityKind } from "@/features/admin-dashboard";

type TProps = {
  items: TActivityItem[];
};

type TKindConfig = {
  icon: ElementType;
  color: string;
};

const KIND_CONFIG: Record<TActivityKind, TKindConfig> = {
  property: { icon: Home, color: "#71717a" },
  user: { icon: UserPlus, color: "#7c3aed" },
  service: { icon: Plug, color: "#0284c7" },
  bill: { icon: Receipt, color: "#0284c7" },
  payment: { icon: CreditCard, color: "#16a34a" },
  reading: { icon: Gauge, color: "#d97706" },
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  electricity: "Electricity",
  gas: "Gas",
  gas_delivery: "Gas delivery",
  cold_water: "Cold water",
  hot_water: "Hot water",
  heating: "Heating",
  building_maintenance: "Building maintenance",
  garbage_collection: "Garbage collection",
  internet: "Internet",
  intercom: "Intercom",
  hoa_fees: "HOA fees",
};

type TActivityLine = {
  label: string;
  detail: string;
};

const getActivityLine = (item: TActivityItem): TActivityLine => {
  const svc = item.serviceTypeCode
    ? (SERVICE_TYPE_LABELS[item.serviceTypeCode] ?? item.serviceTypeCode)
    : "";
  const name = item.name ?? "";

  switch (item.kind) {
    case "property":
      return { label: "New property", detail: name };
    case "user":
      return { label: "New user", detail: name };
    case "service":
      return { label: `${svc} added`, detail: `to ${name}` };
    case "bill":
      return { label: "Bill recorded", detail: `${svc} · ${name}` };
    case "payment":
      return { label: "Payment recorded", detail: `${svc} · ${name}` };
    case "reading":
      return { label: "Reading submitted", detail: `${svc} · ${name}` };
  }
};

export const ActivityFeed = ({ items }: TProps) => {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-2.5">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <span className="text-muted-foreground text-xs">Last 20 across the system.</span>
      </div>
      <DataCard className="overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-4">
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        ) : (
          items.map((item, i) => {
            const { icon: Icon, color } = KIND_CONFIG[item.kind];
            const { label, detail } = getActivityLine(item);
            const isLast = i === items.length - 1;

            return (
              <div
                key={item.id}
                className={cn(
                  "hover:bg-muted/50 flex items-center gap-3.5 px-6 py-3.5 transition-colors duration-150",
                  !isLast && "border-b",
                )}
              >
                <IconBadge icon={Icon} color={color} size="sm" />
                <p className="flex-1 text-sm leading-snug">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground"> — {detail}</span>
                </p>
                <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                  {format(item.occurredAt, "MMM d, yyyy")}
                </span>
              </div>
            );
          })
        )}
      </DataCard>
    </section>
  );
};
