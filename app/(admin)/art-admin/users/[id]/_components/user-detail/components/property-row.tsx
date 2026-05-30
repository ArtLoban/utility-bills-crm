import Link from "next/link";
import { Home, Building2, MapPin, TreePine, ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TPropertyType } from "@/lib/db/schema/properties";
import { RECORD_STATUS } from "@/lib/types/record-status";
import { type TUserPropertyAccess } from "../../../_data/mock";
import { PropertyRoleBadge } from "./property-role-badge";

const PROPERTY_ICONS: Record<TPropertyType, LucideIcon> = {
  apartment: Building2,
  house: Home,
  cottage: TreePine,
  other: MapPin,
};

type TProps = { property: TUserPropertyAccess; isLast: boolean };

export const PropertyRow = ({ property, isLast }: TProps) => {
  const Icon = PROPERTY_ICONS[property.type];
  const isActive = property.status === RECORD_STATUS.ACTIVE;
  const serviceLabel = property.servicesCount === 1 ? "service" : "services";

  return (
    <Link
      href={`/art-admin/properties/${property.id}`}
      className={cn(
        "group flex items-center gap-3.5 px-6 py-3.5 transition-colors duration-150",
        "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        !isLast && "border-border border-b",
      )}
    >
      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
        <Icon size={16} strokeWidth={1.75} className="text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium transition-colors duration-150 group-hover:text-violet-600 dark:group-hover:text-violet-400">
          {property.name}
        </p>
        <p className="text-muted-foreground text-xs">
          {property.servicesCount} {serviceLabel}
          <span className="mx-1">·</span>
          <span className={cn(isActive ? "text-emerald-600 dark:text-emerald-400" : "")}>
            {isActive ? "Active" : "Deleted"}
          </span>
        </p>
      </div>

      <PropertyRoleBadge role={property.role} />

      <ChevronRight
        size={14}
        className="text-muted-foreground shrink-0 transition-colors duration-150 group-hover:text-violet-600 dark:group-hover:text-violet-400"
      />
    </Link>
  );
};
