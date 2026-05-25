import { Home } from "lucide-react";

import { EmptyStateCard } from "@/components/empty-state-card";
import { ROUTES } from "@/lib/routes";
import { AddButton } from "@/components/add-button";

type TProps = {
  firstName: string | null;
};

const DashboardEmptyState = ({ firstName }: TProps) => {
  return (
    <div>
      <h2
        className="text-zinc-950 dark:text-zinc-50"
        style={{
          margin: 0,
          marginBottom: 28,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: -0.6,
        }}
      >
        {firstName ? `Hi, ${firstName}` : "Hello!"}
      </h2>

      <EmptyStateCard
        icon={Home}
        title="Welcome to UtilityBills!"
        body="Start by adding your first property to track your utility bills."
        cta={<AddButton href={`${ROUTES.properties}/new`} text="Add property" />}
      />
    </div>
  );
};

export { DashboardEmptyState };
