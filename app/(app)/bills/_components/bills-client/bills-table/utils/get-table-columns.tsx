import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { AmountCell } from "@/components/data-table/cells/amount-cell";
import { DateCell } from "@/components/data-table/cells/date-cell";
import { ServiceCell } from "@/components/data-table/cells/service-cell";
import type { TBillGlobalRow } from "@/lib/db/access/bills";

import { BillRowActions } from "../components/bill-row-actions";

type TTranslateFn = ReturnType<typeof useTranslations<"bills.list">>;

export const getBillsColumns = (t: TTranslateFn): ColumnDef<TBillGlobalRow>[] => [
  {
    id: "createdAt",
    accessorFn: (row) => row.bill.createdAt,
    header: t("columns.date"),
    cell: ({ row }) => <DateCell value={row.original.bill.createdAt} />,
    enableSorting: true,
  },
  {
    id: "property",
    accessorFn: (row) => row.property.name,
    header: t("columns.property"),
    cell: ({ row }) => row.original.property.name,
    enableSorting: false,
  },
  {
    id: "service",
    accessorFn: (row) => row.serviceTypeCode,
    header: t("columns.service"),
    cell: ({ row }) => <ServiceCell type={row.original.serviceTypeCode} />,
    enableSorting: false,
  },
  {
    id: "periodMonth",
    accessorFn: (row) => row.bill.periodMonth,
    header: t("columns.period"),
    cell: ({ row }) => <DateCell value={row.original.bill.periodMonth} format="month" />,
    enableSorting: true,
  },
  {
    id: "amount",
    accessorFn: (row) => row.bill.amount,
    header: t("columns.amount"),
    cell: ({ row }) => <AmountCell value={parseFloat(row.original.bill.amount)} kind="expense" />,
    enableSorting: true,
    meta: { align: "right" },
  },
  {
    id: "actions",
    header: t("columns.actions"),
    enableSorting: false,
    cell: ({ row }) => <BillRowActions bill={row.original} />,
    meta: { align: "center", width: 100 },
  },
];
