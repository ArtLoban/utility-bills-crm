import { type ElementType } from "react";

import { DataCard } from "@/components/data-card";

type TProps = {
  icon: ElementType;
  iconColor: string;
  value: string;
  label: string;
};

export const StatCard = ({ icon: Icon, iconColor, value, label }: TProps) => {
  return (
    <DataCard className="p-6">
      <div
        className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `${iconColor}1A` }}
      >
        <Icon size={18} strokeWidth={1.75} style={{ color: iconColor }} />
      </div>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground mt-1.5 text-sm">{label}</p>
    </DataCard>
  );
};
