import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DateCell } from "@/components/data-table/cells/date-cell";
import { AmountCell } from "@/components/data-table/cells/amount-cell";
import { ServiceCell } from "@/components/data-table/cells/service-cell";
import { PaymentRowActions } from "@/app/(app)/payments/_components/payments-client/payments-table/components/payment-row-actions";
import { PaymentField, TPayment } from "@/lib/types/models/payment";

type TTranslateFn = ReturnType<typeof useTranslations<"payments.list">>;

export const getPaymentsColumns = (t: TTranslateFn): ColumnDef<TPayment>[] => [
  {
    accessorKey: PaymentField.PAID_AT,
    header: t("columns.date"),
    cell: ({ row }) => <DateCell value={row.original.paidAt} />,
  },
  {
    id: PaymentField.PROPERTY,
    accessorFn: (row) => row.property.id,
    header: t("columns.property"),
    cell: ({ row }) => row.original.property.name,
    filterFn: "equals",
  },
  {
    id: PaymentField.SERVICE,
    accessorFn: (row) => row.service.id,
    header: t("columns.service"),
    cell: ({ row }) => <ServiceCell type={row.original.service.id} />,
    filterFn: "equals",
  },
  {
    accessorKey: PaymentField.AMOUNT,
    header: t("columns.amount"),
    cell: ({ row }) => <AmountCell value={row.original.amount} kind="payment" />,
    meta: { align: "right" },
  },
  {
    id: "actions",
    header: t("columns.actions"),
    enableSorting: false,
    cell: ({ row }) => <PaymentRowActions payment={row.original} />,
    meta: { align: "center", width: 100 },
  },
];
