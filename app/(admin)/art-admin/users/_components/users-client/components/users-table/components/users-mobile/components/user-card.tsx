"use client";

import { User } from "lucide-react";
import Link from "next/link";

import { IconBadge } from "@/components/icon-badge";
import type { TAdminUserRow } from "@/features/admin-users/types";
import { formatRelativeTime } from "@/lib/format/date";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/app/(admin)/art-admin/_components/demo-badge";
import { DeletedBadge } from "@/app/(admin)/art-admin/_components/deleted-badge";
import { RoleBadge } from "@/app/(admin)/art-admin/users/_components/role-badge";

import { UserRowActions } from "../../user-row-actions";

type TProps = { user: TAdminUserRow };

export const UserCard = ({ user }: TProps) => {
  const isDeleted = user.deletedAt !== null;

  return (
    <div
      className={cn(
        "border-border bg-card flex items-center gap-2 rounded-lg border py-3 pr-2.5 pl-3.5 shadow-sm",
        isDeleted && "opacity-60",
      )}
    >
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={User} color="var(--muted-foreground)" size="sm" />
          <Link
            href={`${ROUTES.admin.users}/${user.id}`}
            className={cn(
              "min-w-0 flex-1 truncate font-semibold tracking-tight hover:underline",
              isDeleted && "line-through",
            )}
          >
            {user.email}
          </Link>
          <RoleBadge role={user.systemRole} />
          {user.isDemo && <DemoBadge />}
          {isDeleted && <DeletedBadge />}
        </div>

        {user.name && <div className="text-muted-foreground mt-1.5 truncate">{user.name}</div>}

        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          {user.propertiesCount} {user.propertiesCount === 1 ? "property" : "properties"}
          <span>·</span>
          {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
        </div>
      </div>

      <UserRowActions userId={user.id} />
    </div>
  );
};
