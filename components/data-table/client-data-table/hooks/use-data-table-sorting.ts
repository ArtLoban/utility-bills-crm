import { useCallback, useMemo } from "react";

import { parseAsString, useQueryStates } from "nuqs";
import { Updater } from "@tanstack/table-core";
import { SortingState } from "@tanstack/react-table";
import { DATA_TABLE_PARAMS, SORT_ORDER, TDefaultSorting } from "@/components/data-table/types";

const DEFAULT_SORT_ORDER = SORT_ORDER.DESC;

export const useDataTableSorting = (initial?: TDefaultSorting) => {
  const [query, setQuery] = useQueryStates({
    [DATA_TABLE_PARAMS.SORT_BY]: parseAsString.withDefault(
      initial?.[DATA_TABLE_PARAMS.SORT_BY] ?? "",
    ),
    [DATA_TABLE_PARAMS.SORT_ORDER]: parseAsString.withDefault(
      initial?.[DATA_TABLE_PARAMS.SORT_ORDER] ?? DEFAULT_SORT_ORDER,
    ),
  });

  const sorting = useMemo<SortingState>(() => {
    if (!query.sortBy) {
      return [];
    }

    return [
      {
        id: query.sortBy,
        desc: query.sortOrder === SORT_ORDER.DESC,
      },
    ];
  }, [query.sortBy, query.sortOrder]);

  const setSorting = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;

      const item = next[0];

      if (!item) {
        void setQuery({
          [DATA_TABLE_PARAMS.SORT_BY]: null,
          [DATA_TABLE_PARAMS.SORT_ORDER]: null,
        });

        return;
      }

      void setQuery({
        [DATA_TABLE_PARAMS.SORT_BY]: item.id,
        [DATA_TABLE_PARAMS.SORT_ORDER]: item.desc ? SORT_ORDER.DESC : DEFAULT_SORT_ORDER,
      });
    },
    [setQuery, sorting],
  );

  return {
    sorting,
    setSorting,
  };
};
