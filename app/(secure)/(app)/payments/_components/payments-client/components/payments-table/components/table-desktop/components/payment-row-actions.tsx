"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { TAction } from "@/components/actions-menu/types";
import { ActionsMenu } from "@/components/actions-menu";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import { paymentPath } from "@/lib/routes";
import { usePaymentsTable } from "../../../../../context";

type TProps = {
  payment: TPaymentGlobalRow;
};

export const PaymentRowActions = ({ payment }: TProps) => {
  const t = useTranslations("dataTable.rowActions");
  const { requestDelete } = usePaymentsTable();

  const items: TAction[] = [
    {
      kind: "link",
      label: t("view"),
      icon: <Eye size={14} />,
      href: paymentPath(payment.payment.id),
    },
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `${paymentPath(payment.payment.id)}/edit`,
    },
    { kind: "separator" },
    {
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => requestDelete(payment),
    },
  ];

  return <ActionsMenu items={items} />;
};
