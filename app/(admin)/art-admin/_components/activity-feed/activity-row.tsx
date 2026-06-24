import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/format/date";
import { IconBadge } from "@/components/icon-badge";
import type { TActivityItem } from "@/features/admin-dashboard";

import { ACTIVITY_KIND_VISUALS } from "./constants";
import { getActivityLine } from "./utils";

type TProps = {
  item: TActivityItem;
  isLast: boolean;
};

export const ActivityRow = ({ item, isLast }: TProps) => {
  const { icon: Icon, color } = ACTIVITY_KIND_VISUALS[item.kind];
  const { label, detail } = getActivityLine(item);

  return (
    <div
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
        {formatDisplayDate(item.occurredAt)}
      </span>
    </div>
  );
};
