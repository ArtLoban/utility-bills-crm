"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import { softDeleteService } from "@/features/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";
import { ROUTES } from "@/lib/routes";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceName: string;
};

export const OverflowMenu = ({ serviceId, propertyId, serviceName }: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.detail.header");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await softDeleteService(serviceId);
      if (!result.ok) {
        toast.error(t("delete.error"));
        setConfirmOpen(false);
        return;
      }
      toast.success(t("delete.success"));
      router.push(`${ROUTES.properties}/${propertyId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const items: TAction[] = [
    {
      kind: "item",
      label: t("delete.menu"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => setConfirmOpen(true),
    },
  ];

  return (
    <>
      <ActionsMenu triggerVariant="outline" items={items} />
      <Modal
        title={t("delete.title")}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        variant="destructiveStrong"
        confirmIcon={Trash2}
        confirmLabel={t("delete.confirm")}
        isSaving={isDeleting}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="xl" border={true} />
          <p className="text-center text-sm">
            {t.rich("delete.question", {
              name: serviceName,
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-destructive text-center text-sm leading-snug font-semibold">
            {t("delete.warning")}
          </p>
        </div>
      </Modal>
    </>
  );
};
