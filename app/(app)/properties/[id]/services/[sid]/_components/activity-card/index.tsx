"use client";

import type { TActivityItem } from "../../_data/mock";
import { ActivityRow } from "./components/activity-row";

type TProps = { activity: TActivityItem[] };

const ActivityCard = ({ activity }: TProps) => (
  <div
    className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
  >
    {/* Card header */}
    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
      <span
        className="text-zinc-950 dark:text-zinc-50"
        style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
      >
        Recent activity
      </span>
    </div>

    {/* Rows */}
    <div>
      {activity.map((item, i) => (
        <ActivityRow
          key={`${item.type}-${item.period}`}
          item={item}
          isLast={i === activity.length - 1}
        />
      ))}
    </div>

    {/* Footer */}
    <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
      {/* devnote: wire to /bills?service=sid when service filter is supported */}
      <button
        className="cursor-pointer border-0 bg-transparent text-[13px] font-medium"
        style={{ color: "#7c3aed", padding: 0 }}
      >
        See all activity →
      </button>
    </div>
  </div>
);

export { ActivityCard };
