"use client";

import { useCallback, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { SortingState, Updater } from "@tanstack/react-table";
import {
  DATA_TABLE_PARAMS,
  SORT_ORDER,
  TDefaultSorting,
  TListParams,
} from "@/components/data-table/types";
import {
  DEFAULT_SORT_ORDER,
  PAGE_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from "@/components/data-table/constants";

export const useServerListParams = (initial?: TDefaultSorting): TListParams => {
  const defaultSortBy = initial?.[DATA_TABLE_PARAMS.SORT_BY] ?? "";
  const defaultSortOrder = initial?.[DATA_TABLE_PARAMS.SORT_ORDER] ?? DEFAULT_SORT_ORDER;

  const [params, setParams] = useQueryStates(
    {
      [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(PAGE_DEFAULT),
      [DATA_TABLE_PARAMS.PAGE_SIZE]: parseAsInteger.withDefault(PAGE_SIZE_DEFAULT),
      [DATA_TABLE_PARAMS.SORT_BY]: parseAsString.withDefault(defaultSortBy),
      [DATA_TABLE_PARAMS.SORT_ORDER]: parseAsString.withDefault(defaultSortOrder),
    },
    { history: "replace", shallow: false },
  );

  const sorting = useMemo<SortingState>(
    () =>
      params.sortBy ? [{ id: params.sortBy, desc: params.sortOrder === SORT_ORDER.DESC }] : [],
    [params.sortBy, params.sortOrder],
  );

  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const item = next[0];

      if (!item) {
        void setParams({ sortBy: defaultSortBy, sortOrder: defaultSortOrder, page: PAGE_DEFAULT });
        return;
      }

      void setParams({
        sortBy: item.id,
        sortOrder: item.desc ? SORT_ORDER.DESC : SORT_ORDER.ASC,
        page: PAGE_DEFAULT,
      });
    },
    [setParams, sorting, defaultSortBy, defaultSortOrder],
  );

  const setPage = useCallback((page: number) => void setParams({ page }), [setParams]);

  const setPageSize = useCallback(
    (pageSize: number) => void setParams({ pageSize, page: PAGE_DEFAULT }),
    [setParams],
  );

  return {
    setPage,
    setPageSize,
    sorting,
    onSortingChange,
  };
};
