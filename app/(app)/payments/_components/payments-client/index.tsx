"use client";

import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { AddButton } from "@/components/add-button";
import type { TPaymentsListResult } from "@/features/payments/types";
import { ROUTES } from "@/lib/routes";
import { PaymentsTable } from "./components/payments-table";
import { PaymentsTableActions } from "./components/table-actions";
import { TSelectableEntity } from "@/components/select-input/types";
import { formatUAH } from "@/lib/format/currency";

type TProps = {
  paymentsList: TPaymentsListResult;
  properties: TSelectableEntity[];
};

export const PaymentsClient = ({ paymentsList, properties }: TProps) => {
  const { pagination, totals } = paymentsList;
  const t = useTranslations("payments.list");
  const meta = [t("meta.records", { count: pagination.total }), formatUAH(Number(totals.amount))];

  return (
    <PageContainer
      title={t("title")}
      meta={<PageMeta items={meta} />}
      actions={<AddButton href={`${ROUTES.payments}/new`} text={t("cta.addPayment")} />}
    >
      <PaymentsTableActions properties={properties}>
        <PaymentsTable paymentsList={paymentsList} />
      </PaymentsTableActions>
    </PageContainer>
  );
};
