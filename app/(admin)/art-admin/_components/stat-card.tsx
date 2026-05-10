import { type ElementType } from "react";

import { DataCard } from "@/components/data-card";
import { IconBadge } from "@/components/icon-badge";

type TProps = {
  icon: ElementType;
  iconColor: string;
  value: string;
  label: string;
};

export const StatCard = ({ icon: Icon, iconColor, value, label }: TProps) => {
  return (
    <DataCard className="p-6">
      <div className="mb-5">
        <IconBadge icon={Icon} color={iconColor} />
      </div>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground mt-1.5 text-sm">{label}</p>
    </DataCard>
  );
};
