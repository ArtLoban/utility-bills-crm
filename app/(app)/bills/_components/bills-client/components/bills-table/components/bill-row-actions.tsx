"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { TAction } from "@/components/actions-menu/types";
import { ActionsMenu } from "@/components/actions-menu";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { billPath } from "@/lib/routes";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = {
  bill: TBillGlobalRow;
};

export const BillRowActions = ({ bill }: TProps) => {
  const t = useTranslations("dataTable.rowActions");
  const { requestDelete } = useBillsTable();

  const items: TAction[] = [
    {
      kind: "link",
      label: t("view"),
      icon: <Eye size={14} />,
      href: billPath(bill.bill.id),
    },
    {
      kind: "link",
      label: t("edit"),
      icon: <Pencil size={14} />,
      href: `${billPath(bill.bill.id)}/edit`,
    },
    { kind: "separator" },
    {
      kind: "item",
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => requestDelete(bill),
    },
  ];

  return <ActionsMenu items={items} />;
};
