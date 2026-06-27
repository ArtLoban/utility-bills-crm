"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { InfoBanner } from "@/components/info-banner";
import type { TPropertyMember } from "@/features/sharing/query";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { LastOwnerDialog } from "../last-owner-dialog";
import { LeavePropertyDialog } from "../leave-property-dialog";
import { UserCard } from "./components/user-card";
import { useSharingTab } from "./hooks/use-sharing-tab";

type TProps = {
  propertyId: PropertyId;
  members: TPropertyMember[];
  currentUserId: UserId;
  propertyName: string;
};

export const SharingTab = ({ propertyId, members, currentUserId, propertyName }: TProps) => {
  const t = useTranslations("sharing");
  const {
    members: sharedMembers,
    isOwnerView,
    isLeaving,
    lastOwnerOpen,
    setLastOwnerOpen,
    leaveConfirmOpen,
    setLeaveConfirmOpen,
    requestLeave,
    confirmLeave,
    goToInvite,
    goToRemove,
  } = useSharingTab({ propertyId, members, currentUserId });

  return (
    <div>
      <div className="mb-4">
        <h2 className="m-0 text-lg font-semibold tracking-[-0.2px]">{t("section.title")}</h2>
        <p className="text-muted-foreground mt-1 mb-0 text-sm">{t("section.subtitle")}</p>
      </div>

      <div className="mb-5 flex flex-col gap-2.5">
        {sharedMembers.map((member) => (
          <UserCard
            key={member.id}
            member={member}
            propertyId={propertyId}
            isOwnerView={isOwnerView}
            onRemove={goToRemove}
            onLeave={requestLeave}
          />
        ))}
      </div>

      {isOwnerView ? (
        <>
          <Button size="lg" onClick={goToInvite} disabled={isLeaving}>
            <Plus />
            {t("actions.invite")}
          </Button>
          <div className="mt-4">
            <InfoBanner text={t("banner.ownerInfo")} />
          </div>
        </>
      ) : (
        <InfoBanner text={t("banner.readOnly")} />
      )}

      <LastOwnerDialog
        open={lastOwnerOpen}
        onOpenChange={setLastOwnerOpen}
        propertyName={propertyName}
      />
      <LeavePropertyDialog
        open={leaveConfirmOpen}
        onOpenChange={setLeaveConfirmOpen}
        onConfirm={confirmLeave}
        isPending={isLeaving}
        propertyName={propertyName}
      />
    </div>
  );
};
