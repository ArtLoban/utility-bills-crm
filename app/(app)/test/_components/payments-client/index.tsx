"use client";

import { PageContainer } from "@/components/page-container";
import { useTranslations } from "next-intl";
import { TPayment } from "@/app/(app)/payments/_data/mock";
import { PaymentsTable } from "@/app/(app)/test/_components/payments-client/payments-table";

type TProps = {
  payments: TPayment[];
};

export const PaymentsClient = ({ payments }: TProps) => {
  const t = useTranslations("payments.list");

  return (
    <PageContainer title={t("title")} meta={"meta"} actions={"TODO actions"}>
      <PaymentsTable data={payments} />
    </PageContainer>
  );
};
