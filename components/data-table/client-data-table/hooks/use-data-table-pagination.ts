import { useMemo } from "react";
import { useQueryStates, parseAsInteger } from "nuqs";
import { PAGE_SIZE_DEFAULT, PAGE_DEFAULT } from "@/components/data-table/constants";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";

const PAGE_INDEX_OFFSET = 1;

type TPaginationState = {
  pageIndex: number;
  pageSize: number;
};

export const useDataTablePagination = () => {
  const [query, setQuery] = useQueryStates({
    [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(PAGE_DEFAULT),
    [DATA_TABLE_PARAMS.PAGE_SIZE]: parseAsInteger.withDefault(PAGE_SIZE_DEFAULT),
  });

  const pagination: TPaginationState = useMemo(
    () => ({
      pageIndex: query.page - PAGE_INDEX_OFFSET,
      [DATA_TABLE_PARAMS.PAGE_SIZE]: query.pageSize,
    }),
    [query.page, query.pageSize],
  );

  const setPagination = (
    updater: TPaginationState | ((prev: TPaginationState) => TPaginationState),
  ) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    void setQuery({
      [DATA_TABLE_PARAMS.PAGE]: next.pageIndex + PAGE_INDEX_OFFSET,
      [DATA_TABLE_PARAMS.PAGE_SIZE]: next.pageSize,
    });
  };

  const setPageIndex = (pageIndex: number) => {
    void setQuery((prev) => ({
      [DATA_TABLE_PARAMS.PAGE]: pageIndex,
      [DATA_TABLE_PARAMS.PAGE_SIZE]: prev.pageSize,
    }));
  };

  const setPageSize = (pageSize: number) => {
    void setQuery(() => ({
      [DATA_TABLE_PARAMS.PAGE]: PAGE_DEFAULT,
      [DATA_TABLE_PARAMS.PAGE_SIZE]: pageSize,
    }));
  };

  return {
    pagination,
    setPagination,
    setPageIndex,
    setPageSize,
  };
};
