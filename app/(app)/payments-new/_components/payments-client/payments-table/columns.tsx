import { ColumnDef } from "@tanstack/react-table";

import { TPayment } from "@/app/(app)/payments/_data/mock";
import { formatDateShort } from "@/lib/format/date";
import { formatUAH } from "@/lib/format/currency";

export const paymentColumns: ColumnDef<TPayment>[] = [
  {
    id: "date",
    accessorFn: (row) => row.sortTs,
    header: "columns.date",
    cell: ({ row }) => <span className="tabular-nums">{formatDateShort(row.original.sortTs)}</span>,
  },
  {
    id: "property",
    accessorFn: (row) => row.property.name,
    header: "columns.property",
    cell: ({ row }) => <span className="text-foreground">{row.original.property.name}</span>,
  },
  {
    id: "service",
    accessorFn: (row) => row.service.name,
    header: "columns.service",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.service.name}</span>,
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "columns.amount",
    cell: ({ row }) => (
      <span className="font-medium text-green-600 tabular-nums dark:text-green-500">
        {formatUAH(row.original.amount)}
      </span>
    ),
    meta: { align: "right" },
  },
];
