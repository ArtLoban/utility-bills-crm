"use client";

import { RowActions } from "@/components/data-table/components/row-actions";
import type { TRowAction } from "@/components/data-table/components/row-actions/types";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import { ROUTES } from "@/lib/routes";

import { usePropertiesTable } from "../../../context";

type TProps = { row: TAdminPropertyRow };

export const PropertyRowActions = ({ row }: TProps) => {
  const { openRestore, openHardDelete } = usePropertiesTable();
  const isDeleted = row.deletedAt !== null;
  const detailHref = `${ROUTES.admin.properties}/${row.id}`;

  const items: TRowAction[] = isDeleted
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

  return <RowActions items={items} />;
};
