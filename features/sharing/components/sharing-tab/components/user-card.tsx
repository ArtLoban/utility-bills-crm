"use client";

import { useTranslations } from "next-intl";

import { ActionsMenu } from "@/components/actions-menu";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { TSharedMember } from "../types";
import { RoleBadge } from "./role-badge";
import { RoleSelect } from "./role-select";

type TProps = {
  member: TSharedMember;
  propertyId: PropertyId;
  isOwnerView: boolean;
  isLast: boolean;
  onRemove: (userId: UserId) => void;
  onLeave: () => void;
};

export const UserCard = ({
  member,
  propertyId,
  isOwnerView,
  isLast,
  onRemove,
  onLeave,
}: TProps) => {
  const t = useTranslations("sharing");

  const { id, name, email, role, isYou, meta } = member;
  const isOwner = role === PROPERTY_ROLES.OWNER;
  const canManage = isOwnerView && !isYou && !isOwner;
  const showInlineRole = isYou || (isOwnerView && isOwner);

  return (
    <div
      className={`flex items-start gap-3.5 px-4 py-4.5 sm:items-center sm:px-5 ${!isLast ? "border-border border-b" : ""}`}
    >
      <Avatar size={40} seed={id} name={name} />

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
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

        <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
          {!isOwnerView && !isYou && <RoleBadge role={role} />}
          {canManage && (
            <>
              <RoleSelect value={role} userId={id} propertyId={propertyId} />
              <ActionsMenu
                items={[
                  {
                    kind: "item",
                    label: t("actions.removeAccess"),
                    destructive: true,
                    onSelect: () => onRemove(id),
                  },
                ]}
              />
            </>
          )}
          {isYou && (
            <Button variant="destructive" size="sm" onClick={onLeave}>
              {t("actions.leave")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
