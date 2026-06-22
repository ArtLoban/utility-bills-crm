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
import { Modal } from "@/components/modal";
import { IconBadge } from "@/components/icon-badge";
import { softDeleteMeter } from "@/features/meters/actions";
import { ROUTES } from "@/lib/routes";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  propertyId: string;
  meterId: MeterId;
  meterTitle: string;
};

export const OverflowMenu = ({ propertyId, meterId, meterTitle }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.detail");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      const result = await softDeleteMeter(meterId);
      if (!result.ok) {
        toast.error(t("remove.error"));
        setConfirmOpen(false);
        return;
      }
      toast.success(t("remove.success"));
      router.push(`${ROUTES.properties}/${propertyId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label={t("actions.menu")}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} />
            {t("remove.menu")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        title={t("remove.title")}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleRemove}
        variant="destructiveStrong"
        confirmIcon={Trash2}
        confirmLabel={t("remove.confirm")}
        isSaving={isDeleting}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="xl" border />
          <p className="text-center text-sm">
            {t.rich("remove.question", {
              name: meterTitle,
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-destructive text-center text-sm leading-snug font-semibold">
            {t("remove.warning")}
          </p>
        </div>
      </Modal>
    </>
  );
};
