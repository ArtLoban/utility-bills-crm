import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archive, Home, Receipt, Users } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { requireAdmin } from "@/lib/auth/guards";
import { shouldHideAsNotFound } from "@/lib/errors";
import { getAdminActivityFeed, getAdminDashboardStats } from "@/features/admin-dashboard";
import { PageContainer } from "@/components/page-container";
import { ActivityFeed } from "./_components/activity-feed";
import { StatCard } from "./_components/stat-card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System-wide overview.",
};

export default async function AdminDashboardPage() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    if (shouldHideAsNotFound(guard.error)) notFound();
    throw guard.error;
  }

  const [stats, activityItems, t, format] = await Promise.all([
    getAdminDashboardStats(),
    getAdminActivityFeed(),
    getTranslations("adminDashboard"),
    getFormatter(),
  ]);

  return (
    <PageContainer
      title={t("title")}
      meta={<p className="text-muted-foreground mt-1.5 text-sm">{t("meta")}</p>}
    >
      <div className="space-y-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            iconColor="#7c3aed"
            value={format.number(stats.users)}
            label={t("stats.users")}
          />
          <StatCard
            icon={Home}
            iconColor="#71717a"
            value={format.number(stats.properties)}
            label={t("stats.properties")}
          />
          <StatCard
            icon={Receipt}
            iconColor="#0284c7"
            value={format.number(stats.bills)}
            label={t("stats.bills")}
          />
          <StatCard
            icon={Archive}
            iconColor="#d97706"
            value={format.number(stats.softDeleted)}
            label={t("stats.deletedProperties")}
          />
        </div>
        <ActivityFeed items={activityItems} />
      </div>
    </PageContainer>
  );
}
