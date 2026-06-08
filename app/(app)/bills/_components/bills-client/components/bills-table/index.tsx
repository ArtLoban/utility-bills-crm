import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import { URL_FIELDS, INITIAL_FILTERS } from "./constants";
import { TBillsListResult } from "@/lib/db/access/bills";
import { BillsTableDesktop } from "./components/bills-table";
import { BillsTableMobile } from "./components/bills-mobile";
import { BILLS_SORT_COLUMNS } from "@/features/bills";

type TProps = {
  billsList: TBillsListResult;
};

export const BillsTable = ({ billsList }: TProps) => {
  const listParams = useServerListParams({ sortBy: BILLS_SORT_COLUMNS.PERIOD_MONTH });
  const queryFilters = useQueryFilters(URL_FIELDS, INITIAL_FILTERS);

  return (
    <div>
      <div className="hidden md:block">
        <BillsTableDesktop
          billsList={billsList}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
      <div className="md:hidden">
        <BillsTableMobile
          billsList={billsList}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
    </div>
  );
};
