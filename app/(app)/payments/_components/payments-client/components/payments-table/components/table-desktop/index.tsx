import type { TPaymentsListResult } from "@/features/payments";
import { ServerTableGroup } from "@/components/data-table/server-table-group";
import { TListParams } from "@/components/data-table/types";
import { useTranslations } from "next-intl";
import { FooterMeta } from "./components/footer-meta";
import { getPaymentsColumns } from "./utils/get-table-columns";
import { FilterBar } from "./components/filter-bar";

import type { TQueryFilters } from "../../types";

type TProps = {
  paymentsList: TPaymentsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const PaymentsTableDesktop = (props: TProps) => {
  const { paymentsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = paymentsList;
  const { hasActiveFilters } = queryFilters;

  const t = useTranslations("payments.list");
  const tCommon = useTranslations("common");
  const columns = getPaymentsColumns(t, tCommon("notes.title"));

  return (
    <div>
      <FilterBar queryFilters={queryFilters} />
      <ServerTableGroup
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        footerMeta={<FooterMeta totalAmount={totals.amount} />}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
