import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { ADMIN_USER_SORT_COLUMNS, type TAdminUserRow } from "@/features/admin-users/types";
import { formatRelativeTime } from "@/lib/format/date";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/app/(admin)/art-admin/_components/demo-badge";
import { DeletedBadge } from "@/app/(admin)/art-admin/_components/deleted-badge";
import { RoleBadge } from "@/app/(admin)/art-admin/users/_components/role-badge";

import { UserRowActions } from "../../user-row-actions";

export const getUserColumns = (): ColumnDef<TAdminUserRow>[] => [
  {
    accessorKey: ADMIN_USER_SORT_COLUMNS.EMAIL,
    header: "Email",
    cell: ({ row }) => (
      <Link
        href={`${ROUTES.admin.users}/${row.original.id}`}
        className={cn(
          "font-medium hover:underline",
          row.original.deletedAt && "text-muted-foreground line-through",
        )}
      >
        {row.original.email}
      </Link>
    ),
  },
  {
    accessorKey: ADMIN_USER_SORT_COLUMNS.NAME,
    header: "Name",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.name ?? "—"}</span>,
  },
  {
    id: "systemRole",
    header: "Role",
    enableSorting: false,
    cell: ({ row }) => <RoleBadge role={row.original.systemRole} />,
  },
  {
    id: "propertiesCount",
    header: "Properties",
    enableSorting: false,
    cell: ({ row }) => <span className="tabular-nums">{row.original.propertiesCount}</span>,
    meta: { align: "right" },
  },
  {
    accessorKey: ADMIN_USER_SORT_COLUMNS.CREATED_AT,
    header: "Created",
    cell: ({ row }) => (
      <DateCell value={row.original.createdAt} format="month" className="text-muted-foreground" />
    ),
  },
  {
    accessorKey: ADMIN_USER_SORT_COLUMNS.LAST_LOGIN_AT,
    header: "Last login",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.lastLoginAt ? formatRelativeTime(row.original.lastLoginAt) : "Never"}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "deletedAt",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const isDeleted = row.original.deletedAt !== null;

      return (
        <span className="flex flex-wrap gap-1">
          {row.original.isDemo && <DemoBadge />}
          {isDeleted ? (
            <DeletedBadge />
          ) : (
            !row.original.isDemo && <span className="text-muted-foreground text-sm">Active</span>
          )}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <UserRowActions userId={row.original.id} />,
    meta: { align: "center" },
  },
];
