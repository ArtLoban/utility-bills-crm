import type { PropertyId, TPropertyType } from "@/lib/db/schema";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import { cn } from "@/lib/utils";
import { IconBadge } from "@/components/icon-badge";

type TProps = {
  property: {
    id: PropertyId;
    name: string;
    type: TPropertyType;
  };
  className?: string;
};

export const PropertyCell = ({ property: { name, type }, className }: TProps) => {
  const icon = PROPERTY_TYPE_ICONS[type] || PROPERTY_TYPE_ICONS.other;

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={name}>
      <IconBadge icon={icon} color="var(--neutral-400)" size="xs" />
      {name}
    </span>
  );
};
