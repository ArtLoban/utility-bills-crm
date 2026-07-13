"use client";

import Link from "next/link";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";
import { PROPERTY_TYPE_ICONS, PROPERTY_TYPE_LABELS } from "@/features/properties/property-type";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/app/(secure)/(admin)/art-admin/_components/demo-badge";
import { DeletedBadge } from "@/app/(secure)/(admin)/art-admin/_components/deleted-badge";

import { formatOwners } from "../../../utils/format-owners";
import { PropertyRowActions } from "../../property-row-actions";

type TProps = { row: TAdminPropertyRow };

export const PropertyCard = ({ row }: TProps) => {
  const isDeleted = row.deletedAt !== null;
  const isDemo = row.owners.some((owner) => owner.isDemo);
  const Icon = PROPERTY_TYPE_ICONS[row.type];

  return (
    <Surface
      elevation="sm"
      className={cn("flex items-center gap-2 py-3 pr-2.5 pl-3.5", isDeleted && "opacity-60")}
    >
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color="var(--muted-foreground)" size="sm" />
          <Link
            href={`${ROUTES.admin.properties}/${row.id}`}
            className={cn(
              "min-w-0 flex-1 truncate font-semibold tracking-tight hover:underline",
              isDeleted && "line-through",
            )}
          >
            {row.name}
          </Link>
          {isDemo && <DemoBadge />}
          {isDeleted && <DeletedBadge />}
        </div>

        <div className="text-muted-foreground mt-1.5 truncate">{formatOwners(row.owners)}</div>

        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          {PROPERTY_TYPE_LABELS[row.type]}
          <span>·</span>
          {row.servicesCount} {row.servicesCount === 1 ? "service" : "services"}
          <span>·</span>
          <DateCell value={row.createdAt} format="month" />
        </div>
      </div>

      <PropertyRowActions row={row} />
    </Surface>
  );
};
