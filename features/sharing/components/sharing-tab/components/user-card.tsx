"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { TSharedMember } from "../types";
import { RoleBadge } from "./role-badge";
import { RoleSelect } from "./role-select";

type TProps = {
  member: TSharedMember;
  propertyId: PropertyId;
  isOwnerView: boolean;
  onRemove: (userId: UserId) => void;
  onLeave: () => void;
};

export const UserCard = ({ member, propertyId, isOwnerView, onRemove, onLeave }: TProps) => {
  const t = useTranslations("sharing");

  const { id, name, email, role, isYou, meta } = member;
  const isOwner = role === PROPERTY_ROLES.OWNER;
  const canManage = isOwnerView && !isYou && !isOwner;
  const showInlineRole = isYou || (isOwnerView && isOwner);

  return (
    <div className="border-border bg-card flex flex-row gap-3.5 rounded-lg border px-5 py-4 shadow-sm">
      <Avatar size={40} seed={id} name={name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-row flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold tracking-[-0.1px]">{name}</span>
          {isYou && (
            <span className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-px text-xs font-medium">
              {t("youBadge")}
            </span>
          )}
          {showInlineRole && <RoleBadge role={role} />}
        </div>
        <div className="text-muted-foreground mt-0.5 text-xs">{email}</div>
        <div className="text-muted-foreground mt-1 text-xs">{meta}</div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {!isOwnerView && !isYou && <RoleBadge role={role} />}
        {canManage && (
          <>
            <RoleSelect value={role} userId={id} propertyId={propertyId} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("actions.menu")}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onSelect={() => onRemove(id)}>
                  {t("actions.removeAccess")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {isYou && (
          <Button variant="destructive" size="sm" onClick={onLeave}>
            {t("actions.leave")}
          </Button>
        )}
      </div>
    </div>
  );
};
