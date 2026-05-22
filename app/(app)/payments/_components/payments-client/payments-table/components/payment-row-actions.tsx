"use client";

import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";

import type { TRowAction } from "@/components/data-table/cells/row-actions/types";
import { RowActions } from "@/components/data-table/cells/row-actions";

type TProps = {
  paymentId: string | number;
  onDeleteRequest: () => void;
};

export const PaymentRowActions = ({ paymentId, onDeleteRequest }: TProps) => {
  const t = useTranslations("dataTable.rowActions");

  const items: TRowAction[] = [
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `/payments/${paymentId}/edit`,
    },
    { kind: "separator" },
    {
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: onDeleteRequest,
    },
  ];

  return <RowActions items={items} />;
};
