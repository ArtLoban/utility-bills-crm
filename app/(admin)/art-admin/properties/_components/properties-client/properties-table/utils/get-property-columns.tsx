import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/data-table/components/row-actions";
import type { TAdminPropertyRow } from "@/features/admin-properties";
import { usePropertiesTable } from "../../context";

const formatOwners = (owners: TAdminPropertyRow["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "—";
  return owners.length === 1
    ? (primary.name ?? primary.email)
    : `${primary.name ?? primary.email} (+${owners.length - 1})`;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Separate component so we can call usePropertiesTable() (a hook) inside column cells.
const PropertyRowActions = ({ row }: { row: TAdminPropertyRow }) => {
  const { openRestore, openHardDelete } = usePropertiesTable();
  const isDeleted = row.deletedAt !== null;

  const actions = isDeleted
    ? [
        { kind: "link" as const, label: "View details", href: `/art-admin/properties/${row.id}` },
        { kind: "separator" as const },
        {
          kind: "item" as const,
          label: "Restore",
          onSelect: () => openRestore(row),
        },
        {
          kind: "item" as const,
          label: "Delete permanently",
          destructive: true,
          onSelect: () => openHardDelete(row),
        },
      ]
    : [
        { kind: "link" as const, label: "View details", href: `/art-admin/properties/${row.id}` },
        { kind: "link" as const, label: "Go to property", href: `/properties/${row.id}` },
      ];

  return <RowActions items={actions} />;
};

export const getPropertyColumns = (): ColumnDef<TAdminPropertyRow>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/art-admin/properties/${row.original.id}`}
        className={`font-medium hover:underline ${row.original.deletedAt ? "text-muted-foreground line-through" : ""}`}
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{capitalize(row.original.type)}</span>
    ),
  },
  {
    accessorKey: "deletedAt",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isDemo = row.original.owners.some((o) => o.isDemo);
      return (
        <span className="flex flex-wrap gap-1">
          {isDemo && (
            <Badge
              variant="outline"
              className="border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-400"
            >
              Demo
            </Badge>
          )}
          {row.original.deletedAt ? (
            <Badge
              variant="outline"
              className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
            >
              Deleted
            </Badge>
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
      </span>
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
