"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { toast } from "sonner";

import type { TPropertyMember } from "@/features/sharing/query";
import { leaveProperty } from "@/features/sharing/actions";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { TSharedUser } from "./types";
import { stableAvatarIdx, capitalizeRole } from "./utils";
import { InfoBanner } from "./components/info-banner";
import { UserCard } from "./components/user-card";
import { LastOwnerModal } from "./components/last-owner-modal";

type TProps = {
  propertyId: string;
  members: TPropertyMember[];
  currentUserId: UserId;
  propertyName: string;
};

export const SharingTab = ({ propertyId, members, currentUserId, propertyName }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const fmt = useFormatter();
  const [isPending, startTransition] = useTransition();

  const [lastOwnerOpen, setLastOwnerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const myMember = members.find((m) => m.userId === currentUserId);
  const myRole = myMember?.role ?? "viewer";
  const isOwnerView = myRole === "owner";
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
      return;
    }
    startTransition(async () => {
      const result = await leaveProperty(propertyId as PropertyId);
      if (!result.ok) {
        toast.error(t("toast.leaveError"));
        return;
      }
      router.push("/properties");
    });
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
            propertyId={propertyId}
            isOwnerView={isOwnerView}
            menuOpen={openMenuId === user.id}
            onMenuToggle={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
            onRemove={() => router.push(`/properties/${propertyId}/sharing/${user.id}/remove`)}
            onLeave={handleLeave}
          />
        ))}
      </div>

      {/* Owner-only controls */}
      {isOwnerView && (
        <>
          <button
            onClick={() => router.push(`/properties/${propertyId}/sharing/invite`)}
            disabled={isPending}
            className="inline-flex h-9 cursor-pointer items-center gap-[6px] rounded-[6px] border-0 bg-[#7c3aed] px-4 text-sm font-medium text-white disabled:cursor-default disabled:opacity-60"
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

      <LastOwnerModal
        open={lastOwnerOpen}
        onOpenChange={setLastOwnerOpen}
        propertyName={propertyName}
      />
    </div>
  );
};
