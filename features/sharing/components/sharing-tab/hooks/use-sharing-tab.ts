"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

import { ROUTES } from "@/lib/routes";
import { leaveProperty } from "@/features/sharing/actions";
import type { TPropertyMember } from "@/features/sharing/query";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { TSharedMember } from "../types";

type TParams = {
  propertyId: PropertyId;
  members: TPropertyMember[];
  currentUserId: UserId;
};

export const useSharingTab = ({ propertyId, members, currentUserId }: TParams) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const format = useFormatter();
  const [isLeaving, startLeaving] = useTransition();
  const [lastOwnerOpen, setLastOwnerOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

  const myRole =
    members.find((member) => member.userId === currentUserId)?.role ?? PROPERTY_ROLES.VIEWER;
  const isOwnerView = myRole === PROPERTY_ROLES.OWNER;
  const ownerCount = members.filter((member) => member.role === PROPERTY_ROLES.OWNER).length;
  const isSoleOwner = isOwnerView && ownerCount === 1;

  const sharedMembers: TSharedMember[] = members.map((member) => {
    const { userId, name, email, role, grantedAt, grantedBy } = member;
    const date = format.dateTime(grantedAt, { dateStyle: "medium" });
    const meta = grantedBy?.name
      ? t("meta.addedBy", { name: grantedBy.name, date })
      : t("meta.addedOn", { date });

    return {
      id: userId,
      name: name ?? email,
      email,
      role,
      isYou: userId === currentUserId,
      meta,
    };
  });

  const requestLeave = () => {
    if (isSoleOwner) {
      setLastOwnerOpen(true);

      return;
    }

    setLeaveConfirmOpen(true);
  };

  const confirmLeave = () => {
    startLeaving(async () => {
      const result = await leaveProperty(propertyId);
      if (!result.ok) {
        toast.error(t("toast.leaveError"));

        return;
      }

      toast.success(t("toast.leaveSuccess"));
      router.push(ROUTES.properties);
    });
  };

  // TODO: Extract to component
  const goToRemove = (userId: UserId) =>
    router.push(`${ROUTES.properties}/${propertyId}/sharing/${userId}/remove`);

  return {
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
  };
};
