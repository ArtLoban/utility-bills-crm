import { ColumnDef } from "@tanstack/react-table";
// import { TPayment } from "@/app/(app)/payments/_data/mock";
import { DateCell } from "@/components/feature/data-table/cells/date-cell";
import { AmountCell } from "@/components/feature/data-table/cells/amount-cell";
import { PaymentRowActions } from "@/app/(app)/test/_components/payments-client/payments-table/components/payment-row-actions";
import { useTranslations } from "next-intl";
import { PaymentField, TPayment } from "@/lib/types/models/payment";
import { ServiceCell } from "@/components/feature/data-table/cells/service-cell";

type TTranslateFn = ReturnType<typeof useTranslations<"payments.list">>;

export function getPaymentsColumns(t: TTranslateFn): ColumnDef<TPayment>[] {
  return [
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
      // cell: ({ row }) => row.original.service.name,
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
      cell: ({ row }) => <PaymentRowActions paymentId={row.original.id} />,
      meta: { align: "center", width: 100 },
    },
  ];
}
