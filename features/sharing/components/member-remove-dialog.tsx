"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Avatar } from "@/components/avatar";
import { removePropertyAccess } from "@/features/sharing/actions";
import type { TPropertyMember } from "@/features/sharing/query";
import { errorMessage } from "@/lib/errors";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  member: TPropertyMember;
  propertyId: PropertyId;
  propertyName: string;
};

export const MemberRemoveDialog = ({ member, propertyId, propertyName }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const [isPending, startTransition] = useTransition();

  const { userId, name, email, role } = member;
  const displayName = name ?? email;

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await removePropertyAccess(propertyId, { targetUserId: userId });

      if (!result.ok) {
        const code = errorMessage(result.error);
        if (code === "OWNER_PROTECTED") toast.error(t("errors.OWNER_PROTECTED"));
        else toast.error(t("removeModal.errors.generic"));

        return;
      }

      toast.success(t("toast.removeSuccess"));
      router.back();
    });
  };

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && router.back()}
      tone="destructive"
      icon={<UserMinus size={22} strokeWidth={1.75} />}
      title={t("removeModal.title")}
      entityPreview={
        <>
          <Avatar size={36} seed={userId} name={displayName} />
          <div>
            <div className="text-sm font-semibold">{displayName}</div>
            <div className="text-muted-foreground text-xs">
              {email} · {t(`roles.${role}`)}
            </div>
          </div>
        </>
      }
      description={t.rich("removeModal.body", {
        name: displayName,
        propertyName,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
      secondaryText={t("removeModal.subtext")}
      confirmLabel={isPending ? t("removeModal.removing") : t("actions.removeAccess")}
      cancelLabel={t("actions.cancel")}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
};
