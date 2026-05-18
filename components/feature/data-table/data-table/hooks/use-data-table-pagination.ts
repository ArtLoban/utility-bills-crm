import { useMemo } from "react";
import { useQueryStates, parseAsInteger } from "nuqs";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE_INDEX_DEFAULT,
} from "@/components/feature/data-table/data-table/constants";
import { DataTableField } from "@/components/feature/data-table/data-table/types";

const PAGE_INDEX_OFFSET = 1;

type TPaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function useDataTablePagination() {
  const [query, setQuery] = useQueryStates({
    [DataTableField.PAGE]: parseAsInteger.withDefault(FIRST_PAGE_INDEX_DEFAULT),
    [DataTableField.PAGE_SIZE]: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  });

  const pagination: TPaginationState = useMemo(
    () => ({
      pageIndex: query.page - PAGE_INDEX_OFFSET,
      [DataTableField.PAGE_SIZE]: query.pageSize,
    }),
    [query.page, query.pageSize],
  );

  const setPagination = (
    updater: TPaginationState | ((prev: TPaginationState) => TPaginationState),
  ) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    void setQuery({
      [DataTableField.PAGE]: next.pageIndex + PAGE_INDEX_OFFSET,
      [DataTableField.PAGE_SIZE]: next.pageSize,
    });
  };

  const setPageIndex = (pageIndex: number) => {
    void setQuery((prev) => ({
      [DataTableField.PAGE]: pageIndex,
      [DataTableField.PAGE_SIZE]: prev.pageSize,
    }));
  };

  const setPageSize = (pageSize: number) => {
    void setQuery(() => ({
      [DataTableField.PAGE]: FIRST_PAGE_INDEX_DEFAULT,
      [DataTableField.PAGE_SIZE]: pageSize,
    }));
  };

  return {
    pagination,
    setPagination,
    setPageIndex,
    setPageSize,
  };
}
