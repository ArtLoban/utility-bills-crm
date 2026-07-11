"use client";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { TBillsListResult } from "@/lib/db/access/bills";
import { BillsTable } from "./components/bills-table";
import { useFormatMoney } from "@/lib/format/use-format-money";
import { useTranslations } from "next-intl";
import { TPropertyOption } from "@/features/properties";
import { AddButton } from "@/components/add-button";
import { ROUTES } from "@/lib/routes";
import { BillsTableActions } from "./components/table-actions";

type TProps = {
  billsList: TBillsListResult;
  properties: TPropertyOption[];
};

export const BillsClient = ({ billsList, properties }: TProps) => {
  const { pagination, totals } = billsList;

  const t = useTranslations("bills.list");
  const formatMoney = useFormatMoney();
  const meta = [
    t("meta.records", { count: pagination.total }),
    `${t("footer.totalBilled")}: ${formatMoney(totals.amount)}`,
  ];

  return (
    <PageContainer
      title={t("title")}
      meta={<PageMeta items={meta} />}
      actions={<AddButton href={`${ROUTES.bills}/new`} text={t("cta.addBill")} />}
    >
      <BillsTableActions properties={properties}>
        <BillsTable billsList={billsList} />
      </BillsTableActions>
    </PageContainer>
  );
};
