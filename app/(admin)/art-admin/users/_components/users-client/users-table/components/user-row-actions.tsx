import { Eye } from "lucide-react";

import { RowActions } from "@/components/data-table/cells/row-actions";
import type { TRowAction } from "@/components/data-table/cells/row-actions/types";

type TProps = {
  userId: string;
};

export const UserRowActions = ({ userId }: TProps) => {
  const items: TRowAction[] = [
    {
      kind: "link",
      label: "View details",
      icon: <Eye size={14} />,
      href: `/art-admin/users/${userId}`,
    },
  ];

  return <RowActions items={items} />;
};
