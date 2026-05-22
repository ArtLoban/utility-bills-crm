"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { TPayment } from "@/app/(app)/payments/_data/mock";

import { PaymentsMobile } from "./payments-mobile";
import { PaymentsTable } from "./payments-table";
import { getPaymentsPageMeta } from "./utils/get-payments-page-meta";

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
      actions={
        <Button asChild>
          <Link href="/payments/new">
            <Plus size={14} />
            {t("cta.addPayment")}
          </Link>
        </Button>
      }
    >
      <PaymentsTable data={payments} filteredData={rows} setFilteredData={setRows} />

      <div className="-mx-8 md:hidden">
        <PaymentsMobile payments={payments} />
      </div>
    </PageContainer>
  );
};
