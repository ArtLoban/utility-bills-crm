"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import { softDeleteProperty } from "@/features/properties";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import { ConfirmDialog } from "@/components/confirm-dialog";

type TProps = {
  propertyId: PropertyId;
  propertyName: string;
  role: TPropertyRole;
};

export const PropertyDeleteAction = ({ propertyId, propertyName, role }: TProps) => {
  const t = useTranslations("properties");
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (role !== PROPERTY_ROLES.OWNER) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await softDeleteProperty(propertyId);
      if (!result.ok) {
        toast.error(t("toast.deleteError"));
        setConfirmOpen(false);
        return;
      }
      toast.success(t("toast.deleted"));
      router.push(ROUTES.properties);
    } finally {
      setIsDeleting(false);
    }
  };

  const items: TAction[] = [
    {
      kind: "item",
      label: t("delete.menuItem"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => setConfirmOpen(true),
    },
  ];

  return (
    <>
      <ActionsMenu triggerVariant="outline" items={items} />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="destructive"
        icon={Trash2}
        title={t("delete.title")}
        description={
          <>
            {t("delete.descriptionPrefix")} <strong>{propertyName}</strong>?
          </>
        }
        warningText={t("delete.description")}
        confirmIcon={Trash2}
        confirmLabel={t("delete.confirm")}
        cancelLabel={t("modal.cancel")}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
};
