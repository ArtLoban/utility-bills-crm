"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { InfoBanner } from "@/components/info-banner";
import { SectionCard } from "@/components/section-card";
import type { TPropertyMember } from "@/features/sharing/query";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { LastOwnerDialog } from "../last-owner-dialog";
import { LeavePropertyDialog } from "../leave-property-dialog";
import { UserCard } from "./components/user-card";
import { useSharingTab } from "./hooks/use-sharing-tab";
import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";

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
    goToRemove,
  } = useSharingTab({ propertyId, members, currentUserId });

  return (
    <div>
      <SectionCard
        className="mb-5 overflow-hidden"
        title={t("section.title")}
        description={t("section.subtitle")}
        actions={
          isOwnerView && (
            <LinkButton
              variant="default"
              href={`${ROUTES.properties}/${propertyId}/sharing/invite`}
              icon={Plus}
              text={t("actions.invite")}
              size="sm"
            />
          )
        }
      >
        {sharedMembers.map((member, index) => (
          <UserCard
            key={member.id}
            member={member}
            propertyId={propertyId}
            isOwnerView={isOwnerView}
            isLast={index === sharedMembers.length - 1}
            onRemove={goToRemove}
            onLeave={requestLeave}
          />
        ))}
      </SectionCard>

      <InfoBanner text={t(isOwnerView ? "banner.ownerInfo" : "banner.readOnly")} />

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
