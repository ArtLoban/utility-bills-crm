"use client";

import { useCallback, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { SortingState, Updater } from "@tanstack/react-table";

const PAGE_DEFAULT = 1;
const PAGE_SIZE_DEFAULT = 25;

type TOptions = {
  defaultSortBy: string;
  defaultSortOrder?: "asc" | "desc";
};

// Generic hook for server-driven list pages.
// Syncs page, pageSize, sortBy, sortOrder to the URL with shallow: false
// so each change triggers Next.js navigation and RSC re-render.
export const useServerListParams = ({ defaultSortBy, defaultSortOrder = "desc" }: TOptions) => {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(PAGE_DEFAULT),
      pageSize: parseAsInteger.withDefault(PAGE_SIZE_DEFAULT),
      sortBy: parseAsString.withDefault(defaultSortBy),
      sortOrder: parseAsString.withDefault(defaultSortOrder),
    },
    { history: "replace", shallow: false },
  );

  const sorting = useMemo<SortingState>(
    () => (params.sortBy ? [{ id: params.sortBy, desc: params.sortOrder === "desc" }] : []),
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
        sortOrder: item.desc ? "desc" : "asc",
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

  return { params, sorting, onSortingChange, setPage, setPageSize };
};
