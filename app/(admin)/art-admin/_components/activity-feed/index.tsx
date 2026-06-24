import { DataCard } from "@/components/data-card";
import type { TActivityItem } from "@/features/admin-dashboard";
import { ActivityRow } from "./activity-row";

type TProps = {
  items: TActivityItem[];
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
          items.map((item, i) => (
            <ActivityRow key={item.id} item={item} isLast={i === items.length - 1} />
          ))
        )}
      </DataCard>
    </section>
  );
};
