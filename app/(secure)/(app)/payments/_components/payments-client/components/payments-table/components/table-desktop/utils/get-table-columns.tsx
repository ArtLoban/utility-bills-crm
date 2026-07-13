import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { AmountCell } from "@/components/data-table/cells/amount-cell";
import { DateCell } from "@/components/data-table/cells/date-cell";
import { ServiceCell } from "@/components/data-table/cells/service-cell";
import { TextCell } from "@/components/data-table/cells/text-cell";
import type { TPaymentGlobalRow } from "@/features/payments/types";

import { PaymentRowActions } from "../components/payment-row-actions";
import { PropertyCell } from "@/components/data-table/cells/property-cell";

type TTranslateFn = ReturnType<typeof useTranslations<"payments.list">>;

export const getPaymentsColumns = (
  t: TTranslateFn,
  notesLabel: string,
): ColumnDef<TPaymentGlobalRow>[] => [
  {
    id: "paidAt",
    accessorFn: (row) => row.payment.paidAt,
    header: t("columns.date"),
    cell: ({ row }) => <DateCell value={row.original.payment.paidAt} />,
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
    id: "amount",
    accessorFn: (row) => row.payment.amount,
    header: t("columns.amount"),
    cell: ({ row }) => (
      <AmountCell value={parseFloat(row.original.payment.amount)} kind="payment" />
    ),
    meta: { align: "right", width: 140 },
  },
  {
    id: "notes",
    accessorFn: (row) => row.payment.notes,
    header: notesLabel,
    cell: ({ row }) => <TextCell value={row.original.payment.notes} className="max-w-64" />,
    enableSorting: false,
  },
  {
    id: "actions",
    header: t("columns.actions"),
    enableSorting: false,
    cell: ({ row }) => <PaymentRowActions payment={row.original} />,
    meta: { align: "center", width: 100 },
  },
];
