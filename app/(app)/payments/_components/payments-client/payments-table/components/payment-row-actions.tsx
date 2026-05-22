"use client";

import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";

import type { TRowAction } from "@/components/data-table/cells/row-actions/types";
import { RowActions } from "@/components/data-table/cells/row-actions";
import type { TPayment } from "@/lib/types/models/payment";

import { usePaymentsTable } from "../context";

type TProps = {
  payment: TPayment;
};

export const PaymentRowActions = ({ payment }: TProps) => {
  const t = useTranslations("dataTable.rowActions");
  const { requestDelete } = usePaymentsTable();

  const items: TRowAction[] = [
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `/payments/${payment.id}/edit`,
    },
    { kind: "separator" },
    {
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => requestDelete(payment),
    },
  ];

  return <RowActions items={items} />;
};
