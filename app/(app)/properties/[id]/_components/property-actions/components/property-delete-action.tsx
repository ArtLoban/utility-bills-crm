"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8">
            <MoreHorizontal size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} />
            {t("delete.menuItem")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
