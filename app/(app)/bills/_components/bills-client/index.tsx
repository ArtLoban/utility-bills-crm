"use client";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { TBillsListResult } from "@/lib/db/access/bills";
import { BillsTable } from "./components/bills-table";
import { formatUAH } from "@/lib/format/currency";
import { useTranslations } from "next-intl";
import { TSelectableEntity } from "@/components/select-input/types";
import { AddButton } from "@/components/add-button";
import { ROUTES } from "@/lib/routes";
import { BillsTableActions } from "./components/table-actions";

type TProps = {
  billsList: TBillsListResult;
  properties: TSelectableEntity[];
};

export const BillsClient = ({ billsList, properties }: TProps) => {
  const { pagination, totals } = billsList;

  const t = useTranslations("bills.list");
  const meta = [t("meta.records", { count: pagination.total }), formatUAH(Number(totals.amount))];

  return (
    <PageContainer
      title="Bills"
      meta={<PageMeta items={meta} />}
      actions={<AddButton href={`${ROUTES.bills}/new`} text="Add Bill" />}
    >
      <BillsTableActions properties={properties}>
        <BillsTable billsList={billsList} />
      </BillsTableActions>
    </PageContainer>
  );
};
