"use client";

import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { SORT_ORDER } from "@/components/data-table/types";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import { READINGS_SORT_COLUMNS } from "@/features/readings/types";
import type { TReadingsListResult } from "@/lib/db/access/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { INITIAL_FILTERS, URL_FIELDS } from "./constants";
import { ReadingsDesktop } from "./components/readings-desktop";
import { ReadingsMobile } from "./components/readings-mobile";

type TProps = {
  readingsList: TReadingsListResult;
  meter: TMeter;
  serviceType: TServiceType;
  canMutate: boolean;
};

export const ReadingsTable = ({ readingsList, meter, serviceType, canMutate }: TProps) => {
  const listParams = useServerListParams({
    sortBy: READINGS_SORT_COLUMNS.READ_AT,
    sortOrder: SORT_ORDER.DESC,
  });
  const queryFilters = useQueryFilters(URL_FIELDS, INITIAL_FILTERS);

  return (
    <div>
      <div className="hidden md:block">
        <ReadingsDesktop
          readingsList={readingsList}
          listParams={listParams}
          queryFilters={queryFilters}
          meter={meter}
          serviceType={serviceType}
          canMutate={canMutate}
        />
      </div>
      <div className="md:hidden">
        <ReadingsMobile
          readingsList={readingsList}
          listParams={listParams}
          queryFilters={queryFilters}
          meter={meter}
          serviceType={serviceType}
          canMutate={canMutate}
        />
      </div>
    </div>
  );
};
