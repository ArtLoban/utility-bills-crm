"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import type { TRowAction } from "@/components/data-table/components/row-actions/types";
import { RowActions } from "@/components/data-table/components/row-actions";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { ROUTES } from "@/lib/routes";

type TProps = {
  row: TMeterGlobalRow;
};

export const MeterRowActions = ({ row }: TProps) => {
  const t = useTranslations("meters.list");

  const items: TRowAction[] = [
    {
      kind: "link",
      label: t("actions.viewDetails"),
      icon: <Eye size={14} />,
      href: `${ROUTES.properties}/${row.property.id}/meters/${row.meter.id}`,
    },
  ];

  return <RowActions items={items} />;
};
