// features/payments/payment-row-actions.tsx
"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { RowActions, type TRowAction } from "@/components/cells/row-actions";

type TProps = { paymentId: string };

export const PaymentRowActions = ({ paymentId }: TProps) => {
  const t = useTranslations("payments.actions");

  const items: TRowAction[] = [
    {
      // kind: "link" — triggers soft navigation to /payments/:id.
      // The @modal intercept catches it and opens ViewPaymentModal.
      // No JS state. No modal store. The URL becomes shareable instantly.
      kind: "link",
      href: `/payments/${paymentId}`,
      label: t("view"),
      icon: <Eye size={14} />,
    },
    {
      // Edit will follow the same pattern: /payments/:id/edit intercept.
      // TODO in the next iteration.
      kind: "link",
      href: `/payments/${paymentId}/edit`,
      label: t("edit"),
      icon: <Pencil size={14} />,
    },
    { kind: "separator" },
    {
      // Delete is a confirmation dialog — ephemeral, no URL needed.
      // Local useState / useConfirm hook is the right tool here.
      // TODO: wire up DeletePaymentDialog.
      kind: "item",
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => {
        /* TODO: open local DeletePaymentDialog */
      },
    },
  ];

  return <RowActions items={items} triggerLabel={t("triggerLabel")} />;
};
