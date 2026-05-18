"use client";

import { PageContainer } from "@/components/page-container";
import { useTranslations } from "next-intl";
import { TPayment } from "@/app/(app)/payments/_data/mock";
import { PaymentsTable } from "@/app/(app)/test/_components/payments-client/payments-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getPaymentsPageMeta } from "./utils/get-payments-page-meta";
import { PageMeta } from "@/components/page-meta";

type TProps = {
  payments: TPayment[];
};

export const PaymentsClient = ({ payments }: TProps) => {
  const t = useTranslations("payments.list");
  const [rows, setRows] = useState<TPayment[]>([]);

  const meta = useMemo(() => getPaymentsPageMeta(rows, t), [rows]);

  return (
    <PageContainer
      title={t("title")}
      meta={<PageMeta items={meta} />}
      actions={
        <Button render={<Link href={`/test/new`} />} nativeButton={false}>
          <Plus size={14} />
          {t("cta.recordPayment")}
        </Button>
      }
    >
      <PaymentsTable data={payments} filteredData={rows} setFilteredData={setRows} />
    </PageContainer>
  );
};
