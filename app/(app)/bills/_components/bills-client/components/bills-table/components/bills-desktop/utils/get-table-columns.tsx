import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { AmountCell } from "@/components/data-table/cells/amount-cell";
import { DateCell } from "@/components/data-table/cells/date-cell";
import { ServiceCell } from "@/components/data-table/cells/service-cell";
import { TextCell } from "@/components/data-table/cells/text-cell";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { BillRowActions } from "../../bill-row-actions";
import { PropertyCell } from "@/components/data-table/cells/property-cell";

type TTranslateFn = ReturnType<typeof useTranslations<"bills.list">>;

export const getBillsColumns = (
  t: TTranslateFn,
  notesLabel: string,
): ColumnDef<TBillGlobalRow>[] => [
  {
    id: "createdAt",
    accessorFn: (row) => row.bill.createdAt,
    header: t("columns.date"),
    cell: ({ row }) => <DateCell value={row.original.bill.createdAt} />,
    enableSorting: true,
    meta: { width: 120 },
  },
  {
    id: "property",
    accessorFn: (row) => row.property.name,
    header: t("columns.property"),
    cell: ({ row }) => <PropertyCell property={row.original.property} />,
  },
  {
    id: "service",
    accessorFn: (row) => row.serviceTypeCode,
    header: t("columns.service"),
    cell: ({ row }) => (
      <ServiceCell type={row.original.serviceTypeCode} name={row.original.serviceName} />
    ),
  },
  {
    id: "periodMonth",
    accessorFn: (row) => row.bill.periodMonth,
    header: t("columns.period"),
    cell: ({ row }) => <DateCell value={row.original.bill.periodMonth} format="month" />,
    enableSorting: true,
    meta: { width: 140 },
  },
  {
    id: "amount",
    accessorFn: (row) => row.bill.amount,
    header: t("columns.amount"),
    cell: ({ row }) => <AmountCell value={parseFloat(row.original.bill.amount)} kind="expense" />,
    enableSorting: true,
    meta: { align: "right", width: 140 },
  },
  {
    id: "notes",
    accessorFn: (row) => row.bill.notes,
    header: notesLabel,
    cell: ({ row }) => <TextCell value={row.original.bill.notes} className="max-w-64" />,
    enableSorting: false,
  },
  {
    id: "actions",
    header: t("columns.actions"),
    enableSorting: false,
    cell: ({ row }) => <BillRowActions bill={row.original} />,
    meta: { align: "center", width: 100 },
  },
];
