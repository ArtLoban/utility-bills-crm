import { Eye } from "lucide-react";

import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import { ROUTES } from "@/lib/routes";

type TProps = {
  userId: string;
};

export const UserRowActions = ({ userId }: TProps) => {
  const items: TAction[] = [
    {
      kind: "link",
      label: "View details",
      icon: <Eye size={14} />,
      href: `${ROUTES.admin.users}/${userId}`,
    },
  ];

  return <ActionsMenu items={items} />;
};
