import { Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyStateCard } from "@/components/empty-state-card";
import { ROUTES } from "@/lib/routes";
import { AddButton } from "@/components/add-button";

type TProps = {
  firstName: string | null;
};

export const DashboardEmptyState = async ({ firstName }: TProps) => {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <h2 className="text-foreground mb-7 text-3xl font-semibold tracking-tight">
        {firstName ? t("greeting.withName", { name: firstName }) : t("greeting.fallback")}
      </h2>

      <EmptyStateCard
        icon={Home}
        title={t("empty.title")}
        body={t("empty.body")}
        cta={<AddButton href={`${ROUTES.properties}/new`} text={t("empty.cta")} />}
      />
    </div>
  );
};
