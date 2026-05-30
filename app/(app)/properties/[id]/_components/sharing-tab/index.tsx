"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";

import type { TPropertyMember } from "@/features/sharing";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { AVATAR_PALETTE } from "./constants";
import type { TSharedUser, TUserRole } from "./types";
import { InfoBanner } from "./components/info-banner";
import { UserCard } from "./components/user-card";
import { InviteModal } from "./components/invite-modal";
import { LastOwnerModal } from "./components/last-owner-modal";
import { RemoveUserModal } from "./components/remove-user-modal";

type TProps = {
  members: TPropertyMember[];
  currentUserId: UserId;
  propertyName: string;
};

const capitalizeRole = (r: TPropertyRole): TUserRole =>
  (r.charAt(0).toUpperCase() + r.slice(1)) as TUserRole;

// Deterministic avatar color derived from userId — stable across re-renders and re-fetches
const stableAvatarIdx = (userId: string): number => {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) | 0;
  return Math.abs(h) % AVATAR_PALETTE.length;
};

export const SharingTab = ({ members, currentUserId, propertyName }: TProps) => {
  const t = useTranslations("sharing");
  const fmt = useFormatter();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [lastOwnerOpen, setLastOwnerOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<TSharedUser | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const myMember = members.find((m) => m.userId === currentUserId);
  const myRole: TPropertyRole = myMember?.role ?? "viewer";
  const isOwnerView = myRole === "owner";
  // Sole-owner flag — used in 3b to route the Leave action to the informational modal
  const isSoleOwner = myRole === "owner" && members.filter((m) => m.role === "owner").length === 1;

  const users: TSharedUser[] = members.map((m) => {
    const dateStr = fmt.dateTime(m.grantedAt, { dateStyle: "medium" });
    const meta = m.grantedBy?.name
      ? t("meta.addedBy", { name: m.grantedBy.name, date: dateStr })
      : t("meta.addedOn", { date: dateStr });

    return {
      id: m.userId,
      name: m.name ?? m.email,
      email: m.email,
      role: capitalizeRole(m.role),
      isYou: m.userId === currentUserId,
      avatarIdx: stableAvatarIdx(m.userId),
      meta,
    };
  });

  const handleLeave = () => {
    if (isSoleOwner) {
      setLastOwnerOpen(true);
    }
    // devnote: non-last-owner leave flow (confirmation modal or direct action) not yet implemented
  };

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Section heading */}
      <div className="mb-4">
        <h2 className="m-0 text-lg font-semibold tracking-[-0.2px]">{t("section.title")}</h2>
        <p className="mt-1 mb-0 text-sm text-zinc-500">{t("section.subtitle")}</p>
      </div>

      {/* User list */}
      <div className="mb-5 flex flex-col gap-[10px]">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isOwnerView={isOwnerView}
            menuOpen={openMenuId === user.id}
            onMenuToggle={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
            onRemove={setRemoveUser}
            onLeave={handleLeave}
          />
        ))}
      </div>

      {/* Owner-only controls */}
      {isOwnerView && (
        <>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex h-9 cursor-pointer items-center gap-[6px] rounded-[6px] border-0 bg-[#7c3aed] px-4 text-sm font-medium text-white"
          >
            <Plus size={14} color="#fff" />
            {t("actions.invite")}
          </button>
          <div className="mt-4">
            <InfoBanner text={t("banner.ownerInfo")} />
          </div>
        </>
      )}

      {/* Editor/Viewer: read-only banner */}
      {!isOwnerView && <InfoBanner text={t("banner.readOnly")} />}

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <LastOwnerModal
        open={lastOwnerOpen}
        onOpenChange={setLastOwnerOpen}
        propertyName={propertyName}
      />
      <RemoveUserModal
        open={removeUser !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveUser(null);
        }}
        user={removeUser}
        propertyName={propertyName}
      />
    </div>
  );
};
