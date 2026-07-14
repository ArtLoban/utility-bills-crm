import { type ElementType } from "react";

import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";

type TProps = {
  icon: ElementType;
  iconColor: string;
  value: string;
  label: string;
};

export const StatCard = ({ icon: Icon, iconColor, value, label }: TProps) => {
  return (
    <Surface className="p-6" elevation="sm">
      <div className="mb-5">
        <IconBadge icon={Icon} color={iconColor} />
      </div>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground mt-1.5 text-sm">{label}</p>
    </Surface>
  );
};
