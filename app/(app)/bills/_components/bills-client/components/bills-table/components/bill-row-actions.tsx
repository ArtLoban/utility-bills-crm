"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import type { TAction } from "@/components/actions-menu/types";
import { ActionsMenu } from "@/components/actions-menu";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = {
  bill: TBillGlobalRow;
};

export const BillRowActions = ({ bill }: TProps) => {
  const router = useRouter();
  const { requestDelete } = useBillsTable();

  const items: TAction[] = [
    {
      kind: "item",
      label: "Edit",
      icon: <Pencil size={14} />,
      onSelect: () => router.push(`/bills/${bill.bill.id}/edit`),
    },
    { kind: "separator" },
    {
      kind: "item",
      label: "Delete",
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => requestDelete(bill),
    },
  ];

  return <ActionsMenu items={items} />;
};
