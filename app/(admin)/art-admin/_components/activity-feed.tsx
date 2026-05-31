import { type ElementType } from "react";

import { CreditCard, Gauge, Home, Plug, Receipt, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
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

type TActivityLine = {
  label: string;
  detail: string;
};

const getActivityLine = (
  item: TActivityItem,
  t: Awaited<ReturnType<typeof getTranslations<"adminDashboard">>>,
  tServices: Awaited<ReturnType<typeof getTranslations<"services">>>,
): TActivityLine => {
  const svc = item.serviceTypeCode
    ? tServices(`types.${item.serviceTypeCode}` as Parameters<typeof tServices>[0])
    : "";
  const name = item.name ?? "";

  switch (item.kind) {
    case "property":
      return {
        label: t("activity.property.label"),
        detail: t("activity.property.detail", { name }),
      };
    case "user":
      return {
        label: t("activity.user.label"),
        detail: t("activity.user.detail", { name }),
      };
    case "service":
      return {
        label: t("activity.service.label", { service: svc }),
        detail: t("activity.service.detail", { property: name }),
      };
    case "bill":
      return {
        label: t("activity.bill.label"),
        detail: t("activity.bill.detail", { service: svc, property: name }),
      };
    case "payment":
      return {
        label: t("activity.payment.label"),
        detail: t("activity.payment.detail", { service: svc, property: name }),
      };
    case "reading":
      return {
        label: t("activity.reading.label"),
        detail: t("activity.reading.detail", { service: svc, property: name }),
      };
  }
};

export const ActivityFeed = async ({ items }: TProps) => {
  const [t, tServices] = await Promise.all([
    getTranslations("adminDashboard"),
    getTranslations("services"),
  ]);

  return (
    <section>
      <div className="mb-4 flex items-baseline gap-2.5">
        <h2 className="text-sm font-semibold">{t("activity.heading")}</h2>
        <span className="text-muted-foreground text-xs">{t("activity.subheading")}</span>
      </div>
      <DataCard className="overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-4">
            <p className="text-muted-foreground text-sm">{t("activity.empty")}</p>
          </div>
        ) : (
          items.map((item, i) => {
            const { icon: Icon, color } = KIND_CONFIG[item.kind];
            const { label, detail } = getActivityLine(item, t, tServices);
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
