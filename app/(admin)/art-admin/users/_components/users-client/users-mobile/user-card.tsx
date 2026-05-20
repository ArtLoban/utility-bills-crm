import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TAdminUser } from "../../../_data/mock";
import { RoleBadge } from "../components/role-badge";

type TProps = {
  user: TAdminUser;
};

export const UserCard = ({ user }: TProps) => {
  const isDeleted = user.status === "deleted";

  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${isDeleted ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-sm font-semibold tracking-tight">{user.email}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-transparent data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100 dark:data-popup-open:border-zinc-700 dark:data-popup-open:bg-zinc-800">
            <MoreHorizontal
              size={15}
              strokeWidth={1.75}
              className="text-zinc-950 dark:text-zinc-50"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem render={<Link href={`/art-admin/users/${user.id}`} />}>
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">{user.name}</p>

      <p className="mt-0.5 text-xs text-zinc-400 tabular-nums dark:text-zinc-600">
        {user.propertiesCount} {user.propertiesCount === 1 ? "property" : "properties"} ·{" "}
        {user.createdDisplay}
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        <RoleBadge role={user.systemRole} />
        {isDeleted && (
          <Badge
            variant="outline"
            className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
          >
            Deleted
          </Badge>
        )}
      </div>
    </div>
  );
};
