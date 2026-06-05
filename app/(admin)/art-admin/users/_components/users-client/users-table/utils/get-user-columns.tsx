import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import type { TAdminUserRow } from "@/features/admin-users/types";
import { RoleBadge } from "../../../../_components/role-badge";
import { UserRowActions } from "../components/user-row-actions";

export const getUserColumns = (): ColumnDef<TAdminUserRow>[] => [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-zinc-500 dark:text-zinc-400">{row.original.name ?? "—"}</span>
    ),
  },
  {
    accessorKey: "systemRole",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.original.systemRole} />,
    enableSorting: false,
  },
  {
    accessorKey: "propertiesCount",
    header: "Properties",
    cell: ({ row }) => <span className="tabular-nums">{row.original.propertiesCount}</span>,
    meta: { align: "right" },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-zinc-500 tabular-nums dark:text-zinc-400">
        {row.original.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last login",
    cell: ({ row }) => (
      <span className="text-zinc-500 tabular-nums dark:text-zinc-400">
        {row.original.lastLoginAt
          ? formatDistanceToNow(row.original.lastLoginAt, { addSuffix: true })
          : "Never"}
      </span>
    ),
  },
  {
    accessorKey: "deletedAt",
    header: "Status",
    cell: ({ row }) =>
      row.original.deletedAt ? (
        <Badge
          variant="outline"
          className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
        >
          Deleted
        </Badge>
      ) : null,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <UserRowActions userId={row.original.id} />,
    meta: { align: "center" },
  },
];
