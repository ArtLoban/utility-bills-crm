"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { TPayment } from "@/app/(app)/payments/_data/mock";

import { PaymentsMobile } from "./payments-mobile";
import { PaymentsTable } from "./payments-table";
import { getPaymentsPageMeta } from "./utils/get-payments-page-meta";
import { AddButton } from "@/components/add-button";
import { ROUTES } from "@/lib/routes";

type TProps = {
  payments: TPayment[];
};

export const PaymentsClient = ({ payments }: TProps) => {
  const t = useTranslations("payments.list");
  const [rows, setRows] = useState<TPayment[] | null>(null);

  const metaItems = rows !== null ? getPaymentsPageMeta(rows, t) : null;

  return (
    <PageContainer
      title={t("title")}
      meta={<PageMeta items={metaItems} />}
      actions={<AddButton href={`${ROUTES.payments}/new`} text={t("cta.addPayment")} />}
    >
      <PaymentsTable data={payments} filteredData={rows} setFilteredData={setRows} />
      <div className="-mx-8 md:hidden">
        <PaymentsMobile payments={payments} />
      </div>
    </PageContainer>
  );
};
