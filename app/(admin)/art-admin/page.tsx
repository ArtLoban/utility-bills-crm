import type { Metadata } from "next";

import { PageContainer } from "@/components/page-container";
import { ActivityFeed } from "./_components/activity-feed";
import { StatCard } from "./_components/stat-card";
import { STAT_CARDS } from "./constants";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System-wide overview.",
};

export default function AdminDashboardPage() {
  return (
    <PageContainer
      title="Admin dashboard"
      meta={<p className="text-muted-foreground mt-1.5 text-sm">System-wide overview.</p>}
    >
      <div className="space-y-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
        <ActivityFeed />
      </div>
    </PageContainer>
  );
}
