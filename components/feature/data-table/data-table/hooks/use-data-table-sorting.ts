import { useCallback, useMemo } from "react";

import { parseAsString, useQueryStates } from "nuqs";
import { Updater } from "@tanstack/table-core";
import { SortingState } from "@tanstack/react-table";
import {
  DataTableField,
  SortOrder,
  TDefaultSorting,
} from "@/components/feature/data-table/data-table/types";

const DEFAULT_SORT_ORDER = SortOrder.DESC;

export function useDataTableSorting(initial?: TDefaultSorting) {
  const [query, setQuery] = useQueryStates({
    [DataTableField.SORT_BY]: parseAsString.withDefault(initial?.[DataTableField.SORT_BY] ?? ""),
    [DataTableField.SORT_ORDER]: parseAsString.withDefault(
      initial?.[DataTableField.SORT_ORDER] ?? DEFAULT_SORT_ORDER,
    ),
  });

  const sorting = useMemo<SortingState>(() => {
    if (!query.sortBy) {
      return [];
    }

    return [
      {
        id: query.sortBy,
        desc: query.sortOrder === SortOrder.DESC,
      },
    ];
  }, [query.sortBy, query.sortOrder]);

  const setSorting = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;

      const item = next[0];

      if (!item) {
        void setQuery({
          [DataTableField.SORT_BY]: null,
          [DataTableField.SORT_ORDER]: null,
        });

        return;
      }

      void setQuery({
        [DataTableField.SORT_BY]: item.id,
        [DataTableField.SORT_ORDER]: item.desc ? SortOrder.DESC : DEFAULT_SORT_ORDER,
      });
    },
    [setQuery, sorting],
  );

  return {
    sorting,
    setSorting,
  };
}
