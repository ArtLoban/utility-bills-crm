import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { PaymentsTableDesktop } from "./components/TableDesktop";
import { PaymentsTableMobile } from "./components/TableMobile";
import type { TPaymentsListResult } from "@/features/payments";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import { URL_FIELDS, INITIAL_FILTERS } from "./constants";

type TProps = {
  paymentsList: TPaymentsListResult;
};

export const PaymentsTable = ({ paymentsList }: TProps) => {
  const listParams = useServerListParams();
  const queryFilters = useQueryFilters(URL_FIELDS, INITIAL_FILTERS);

  return (
    <div>
      <div className="hidden md:block">
        <PaymentsTableDesktop
          paymentsList={paymentsList}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
      <div className="-mx-8 md:hidden">
        <PaymentsTableMobile
          paymentsList={paymentsList}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
    </div>
  );
};
