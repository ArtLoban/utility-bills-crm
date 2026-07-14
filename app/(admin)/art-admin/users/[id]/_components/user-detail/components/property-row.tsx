import Link from "next/link";
import { Home, Building2, MapPin, TreePine, ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROPERTY_TYPES, type TPropertyType } from "@/lib/db/schema/properties";
import type { TAdminUserPropertyAccess } from "@/features/admin-users/types";
import { PropertyRoleBadge } from "./property-role-badge";

const PROPERTY_ICONS: Record<TPropertyType, LucideIcon> = {
  [PROPERTY_TYPES.APARTMENT]: Building2,
  [PROPERTY_TYPES.HOUSE]: Home,
  [PROPERTY_TYPES.COTTAGE]: TreePine,
  [PROPERTY_TYPES.OTHER]: MapPin,
};

type TProps = {
  property: TAdminUserPropertyAccess;
  userId: string;
  isLast: boolean;
};

export const PropertyRow = ({ property, userId, isLast }: TProps) => {
  const Icon = PROPERTY_ICONS[property.propertyType];
  const isDeleted = property.propertyDeletedAt !== null;

  // Forward-link to admin properties list filtered by this user (Step 2 wires the filter).
  const href = `/art-admin/properties?owner=${userId}`;

  return (
    <Link
      href={href}
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
          {property.propertyName}
        </p>
        <p
          className={cn(
            "text-xs",
            isDeleted ? "text-red-500 dark:text-red-400" : "text-muted-foreground",
          )}
        >
          {isDeleted ? "Deleted" : "Active"}
        </p>
      </div>

      <PropertyRoleBadge role={property.propertyRole} />

      <ChevronRight
        size={14}
        className="text-muted-foreground shrink-0 transition-colors duration-150 group-hover:text-violet-600 dark:group-hover:text-violet-400"
      />
    </Link>
  );
};
