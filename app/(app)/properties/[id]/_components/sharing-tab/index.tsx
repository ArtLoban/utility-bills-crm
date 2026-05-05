"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { MOCK_SHARED_USERS } from "./constants";
import { TSharedUser } from "./types";
import { InfoBanner } from "./components/info-banner";
import { UserCard } from "./components/user-card";
import { InviteModal } from "./components/invite-modal";
import { LastOwnerModal } from "./components/last-owner-modal";
import { RemoveUserModal } from "./components/remove-user-modal";

type TProps = {
  myRole: "owner" | "editor" | "viewer";
  propertyName: string;
};

export const SharingTab = ({ myRole, propertyName }: TProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [lastOwnerOpen, setLastOwnerOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<TSharedUser | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isOwnerView = myRole === "owner";
  const users = MOCK_SHARED_USERS;

  const handleLeave = () => {
    const isLastOwner = users.filter((u) => u.role === "Owner").length === 1;
    if (isLastOwner) {
      setLastOwnerOpen(true);
    }
    // devnote: non-last-owner leave flow (confirmation modal or direct action) not yet implemented
  };

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Section heading */}
      <div className="mb-4">
        <h2 className="m-0 text-lg font-semibold tracking-[-0.2px]">People with access</h2>
        <p className="mt-1 mb-0 text-sm text-zinc-500">
          Manage who can view or edit this property.
        </p>
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
            Invite person
          </button>
          <div className="mt-4">
            <InfoBanner text="People you invite need an existing account. They will get immediate access — no email confirmation required in this version." />
          </div>
        </>
      )}

      {/* Editor/Viewer: read-only banner */}
      {!isOwnerView && <InfoBanner text="Only owners can invite people and change roles." />}

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
      />
    </div>
  );
};
