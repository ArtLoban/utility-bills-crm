import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { DateCell } from "@/components/data-table/cells/date-cell";
import {
  ADMIN_PROPERTY_SORT_COLUMNS,
  type TAdminPropertyRow,
} from "@/features/admin-properties/types";
import { PROPERTY_TYPE_LABELS } from "@/features/properties/property-type";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/app/(admin)/art-admin/_components/demo-badge";
import { DeletedBadge } from "@/app/(admin)/art-admin/_components/deleted-badge";

import { formatOwners } from "../../../utils/format-owners";
import { PropertyRowActions } from "../../property-row-actions";

export const getPropertyColumns = (): ColumnDef<TAdminPropertyRow>[] => [
  {
    accessorKey: ADMIN_PROPERTY_SORT_COLUMNS.NAME,
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`${ROUTES.admin.properties}/${row.original.id}`}
        className={cn(
          "font-medium hover:underline",
          row.original.deletedAt && "text-muted-foreground line-through",
        )}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "owners",
    header: "Owner(s)",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatOwners(row.original.owners)}</span>
    ),
  },
  {
    accessorKey: ADMIN_PROPERTY_SORT_COLUMNS.TYPE,
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{PROPERTY_TYPE_LABELS[row.original.type]}</span>
    ),
  },
  {
    id: ADMIN_PROPERTY_SORT_COLUMNS.STATUS,
    accessorKey: "deletedAt",
    header: "Status",
    cell: ({ row }) => {
      const isDemo = row.original.owners.some((owner) => owner.isDemo);
      const isDeleted = row.original.deletedAt !== null;

      return (
        <span className="flex flex-wrap gap-1">
          {isDemo && <DemoBadge />}
          {isDeleted ? (
            <DeletedBadge />
          ) : (
            !isDemo && <span className="text-muted-foreground text-sm">Active</span>
          )}
        </span>
      );
    },
  },
  {
    id: "servicesCount",
    header: "Services",
    enableSorting: false,
    cell: ({ row }) => <span className="tabular-nums">{row.original.servicesCount}</span>,
    meta: { align: "right" },
  },
  {
    accessorKey: ADMIN_PROPERTY_SORT_COLUMNS.CREATED_AT,
    header: "Created",
    cell: ({ row }) => (
      <DateCell value={row.original.createdAt} format="month" className="text-muted-foreground" />
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <PropertyRowActions row={row.original} />,
    meta: { align: "center" },
  },
];
