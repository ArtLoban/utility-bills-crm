import { Eye } from "lucide-react";

import { RowActions } from "@/components/data-table/components/row-actions";
import type { TRowAction } from "@/components/data-table/components/row-actions/types";
import { ROUTES } from "@/lib/routes";

type TProps = {
  userId: string;
};

export const UserRowActions = ({ userId }: TProps) => {
  const items: TRowAction[] = [
    {
      kind: "link",
      label: "View details",
      icon: <Eye size={14} />,
      href: `${ROUTES.admin.users}/${userId}`,
    },
  ];

  return <RowActions items={items} />;
};
