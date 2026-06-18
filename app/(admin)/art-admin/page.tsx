import type { Metadata } from "next";
import { Archive, Home, Receipt, Users } from "lucide-react";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { getAdminActivityFeed, getAdminDashboardStats } from "@/features/admin-dashboard";
import { PageContainer } from "@/components/page-container";
import { ActivityFeed } from "./_components/activity-feed";
import { StatCard } from "./_components/stat-card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System-wide overview.",
};

export default async function AdminDashboardPage() {
  await unwrapOrThrow(await requireAdmin());

  const [stats, activityItems] = await Promise.all([
    getAdminDashboardStats(),
    getAdminActivityFeed(),
  ]);

  return (
    <PageContainer
      title="Admin dashboard"
      meta={<p className="text-muted-foreground mt-1.5 text-sm">System-wide overview.</p>}
    >
      <div className="space-y-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            iconColor="#7c3aed"
            value={String(stats.users)}
            label="Total users"
          />
          <StatCard
            icon={Home}
            iconColor="#71717a"
            value={String(stats.properties)}
            label="Active properties"
          />
          <StatCard
            icon={Receipt}
            iconColor="#0284c7"
            value={String(stats.bills)}
            label="Bills recorded"
          />
          <StatCard
            icon={Archive}
            iconColor="#d97706"
            value={String(stats.softDeleted)}
            label="Deleted properties"
          />
        </div>
        <ActivityFeed items={activityItems} />
      </div>
    </PageContainer>
  );
}
