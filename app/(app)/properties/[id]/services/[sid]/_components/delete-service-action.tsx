"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export const DeleteServiceAction = ({ serviceId, propertyId, serviceName }: TProps) => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label={t("delete.menu")}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} />
            {t("delete.menu")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
          <IconBadge icon={Trash2} color="var(--destructive)" size="lg" border={true} />
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
