"use client";

import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import { ROUTES } from "@/lib/routes";

import { usePropertiesTable } from "../../../context";

type TProps = { row: TAdminPropertyRow };

export const PropertyRowActions = ({ row }: TProps) => {
  const { openRestore, openHardDelete } = usePropertiesTable();
  const isDeleted = row.deletedAt !== null;
  const detailHref = `${ROUTES.admin.properties}/${row.id}`;

  const items: TAction[] = isDeleted
    ? [
        { kind: "link", label: "View details", href: detailHref },
        { kind: "separator" },
        { kind: "item", label: "Restore", onSelect: () => openRestore(row) },
        {
          kind: "item",
          label: "Delete permanently",
          destructive: true,
          onSelect: () => openHardDelete(row),
        },
      ]
    : [
        { kind: "link", label: "View details", href: detailHref },
        { kind: "link", label: "Go to property", href: `${ROUTES.properties}/${row.id}` },
      ];

  return <ActionsMenu items={items} />;
};
