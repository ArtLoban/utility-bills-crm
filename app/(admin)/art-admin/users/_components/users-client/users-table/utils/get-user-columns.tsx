import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { TAdminUser } from "../../../../_data/mock";
import { RoleBadge } from "../../../../_components/role-badge";
import { UserRowActions } from "../components/user-row-actions";

export const getUserColumns = (): ColumnDef<TAdminUser>[] => [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-zinc-500 dark:text-zinc-400">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "systemRole",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.original.systemRole} />,
    filterFn: "equals",
    enableSorting: false,
  },
  {
    accessorKey: "propertiesCount",
    header: "Properties",
    cell: ({ row }) => <span className="tabular-nums">{row.original.propertiesCount}</span>,
    meta: { align: "right" },
  },
  {
    accessorKey: "createdSort",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-zinc-500 tabular-nums dark:text-zinc-400">
        {row.original.createdDisplay}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "lastLoginSort",
    header: "Last login",
    cell: ({ row }) => (
      <span className="text-zinc-500 tabular-nums dark:text-zinc-400">
        {row.original.lastLoginDisplay}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "deleted" ? (
        <Badge
          variant="outline"
          className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
        >
          Deleted
        </Badge>
      ) : null,
    filterFn: "equals",
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
