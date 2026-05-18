// features/payments/payment-view-content.tsx
//
// Pure presentational component. Knows nothing about modals or pages.
// Used by both the intercepted modal AND the full /payments/[id] page,
// guaranteeing identical content in both contexts.

import { useTranslations } from "next-intl";

import { AmountCell } from "@/components/cells/amount-cell";
import { DateCell } from "@/components/cells/date-cell";
import { ServiceCell, type TServiceType } from "@/components/cells/service-cell";

export type TPaymentView = {
  id: string;
  paidAt: string;
  amount: number;
  serviceType: TServiceType;
  propertyName: string;
  notes: string | null;
};

type TProps = {
  payment: TPaymentView;
};

export const PaymentViewContent = ({ payment }: TProps) => {
  const t = useTranslations("payments.view");

  return (
    <div className="space-y-4">
      <Field label={t("fields.date")}>
        <DateCell value={payment.paidAt} format="full" />
      </Field>

      <Field label={t("fields.property")}>{payment.propertyName}</Field>

      <Field label={t("fields.service")}>
        <ServiceCell type={payment.serviceType} />
      </Field>

      <Field label={t("fields.amount")}>
        <AmountCell value={payment.amount} kind="payment" />
      </Field>

      {payment.notes && (
        <Field label={t("fields.notes")}>
          <p className="text-sm whitespace-pre-wrap">{payment.notes}</p>
        </Field>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[120px_1fr] items-baseline gap-3">
    <dt className="text-muted-foreground text-sm">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
);
