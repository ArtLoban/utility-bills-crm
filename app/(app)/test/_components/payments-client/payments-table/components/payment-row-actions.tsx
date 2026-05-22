"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { TRowAction } from "@/components/data-table/cells/row-actions/types";
import { RowActions } from "@/components/data-table/cells/row-actions";

type TProps = {
  paymentId: string | number;
};

export const PaymentRowActions = ({ paymentId }: TProps) => {
  const t = useTranslations("dataTable.rowActions");

  const handleSelect = () => {
    console.log("handleSelect", paymentId);
  };

  const items: TRowAction[] = [
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `/test/${paymentId}/edit`,
    },
    { kind: "separator" },
    {
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: handleSelect,
    },
  ];

  return <RowActions items={items} />;
};
