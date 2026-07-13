"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { LinkButton } from "@/components/link-button";
import { ActionsMenu } from "@/components/actions-menu";
import type { TAction } from "@/components/actions-menu/types";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { softDeleteBill } from "@/features/bills/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { ROUTES, billPath, serviceDetailPath } from "@/lib/routes";
import type { TBillGlobalRow } from "@/lib/db/access/bills";

type TProps = {
  bill: TBillGlobalRow;
  canMutate: boolean;
  serviceLabel: string;
};

export const BillDetailActions = ({ bill, canMutate, serviceLabel }: TProps) => {
  const { bill: record, property } = bill;
  const t = useTranslations("bills");
  const tActions = useTranslations("dataTable.rowActions");
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleActionError = useActionErrorHandler({ onClose: () => setConfirmOpen(false) });

  const handleDelete = () => {
    startTransition(async () => {
      const result = await softDeleteBill(record.id);
      if (!result.ok) {
        handleActionError(result.error);
        return;
      }
      toast.success(t("toast.deleted"));
      router.push(ROUTES.bills);
    });
  };

  const menuItems: TAction[] = [
    {
      kind: "item",
      label: tActions("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => setConfirmOpen(true),
    },
  ];

  return (
    <div className="flex shrink-0 items-center gap-2">
      <LinkButton
        href={serviceDetailPath(property.id, record.serviceId)}
        icon={ExternalLink}
        text={t("detail.actions.openService")}
        size="default"
      />
      {canMutate && (
        <>
          <LinkButton
            href={`${billPath(record.id)}/edit`}
            icon={Pencil}
            text={tActions("edit")}
            variant="default"
            size="default"
          />
          <ActionsMenu triggerVariant="outline" items={menuItems} />
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={t("delete.confirm.title")}
            icon={Trash2}
            description={t.rich("delete.confirm.description", {
              service: serviceLabel,
              property: property.name,
              b: (chunks) => <strong>{chunks}</strong>,
            })}
            warningText={t("delete.confirm.body")}
            confirmLabel={t("delete.confirm.confirmLabel")}
            confirmIcon={Trash2}
            cancelLabel={t("delete.confirm.cancelLabel")}
            isPending={isPending}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
};
