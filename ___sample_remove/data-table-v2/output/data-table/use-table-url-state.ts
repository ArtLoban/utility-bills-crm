"use client";

import { useCallback, useMemo } from "react";
import { createParser, parseAsInteger, useQueryState } from "nuqs";
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE, DEFAULT_URL_KEYS, PAGE_SIZE_OPTIONS } from "./constants";
import type { TResolvedUrlKeys, TUrlKeys } from "./types";

/**
 * Parses "<columnId>.<asc|desc>" into a single-column SortingState.
 * Empty or malformed values resolve to an empty array ("no sort").
 */
const sortParser = createParser<SortingState>({
  parse: (value) => {
    if (!value) return [];
    const [id, dir] = value.split(".");
    if (!id || (dir !== "asc" && dir !== "desc")) return [];
    return [{ id, desc: dir === "desc" }];
  },
  serialize: (sorting) => {
    const entry = sorting[0];
    if (!entry) return "";
    return `${entry.id}.${entry.desc ? "desc" : "asc"}`;
  },
  eq: (a, b) => {
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;
    return a[0]!.id === b[0]!.id && a[0]!.desc === b[0]!.desc;
  },
});

type TUseTableUrlStateOptions = {
  defaultPageSize?: number;
  defaultSorting?: SortingState;
  urlKeys?: TUrlKeys;
};

type TUseTableUrlStateResult = {
  pagination: PaginationState;
  sorting: SortingState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
};

const isValidPageSize = (n: number): boolean =>
  (PAGE_SIZE_OPTIONS as readonly number[]).includes(n);

const NUQS_OPTIONS = { history: "replace", shallow: true } as const;

export const useTableUrlState = ({
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultSorting = [],
  urlKeys,
}: TUseTableUrlStateOptions = {}): TUseTableUrlStateResult => {
  const keys: TResolvedUrlKeys = useMemo(
    () => ({
      page: urlKeys?.page ?? DEFAULT_URL_KEYS.page,
      pageSize: urlKeys?.pageSize ?? DEFAULT_URL_KEYS.pageSize,
      sort: urlKeys?.sort ?? DEFAULT_URL_KEYS.sort,
    }),
    [urlKeys?.page, urlKeys?.pageSize, urlKeys?.sort],
  );

  const [rawPage, setRawPage] = useQueryState(
    keys.page,
    parseAsInteger.withDefault(1).withOptions(NUQS_OPTIONS),
  );
  const [rawPageSize, setRawPageSize] = useQueryState(
    keys.pageSize,
    parseAsInteger.withDefault(defaultPageSize).withOptions(NUQS_OPTIONS),
  );
  const [sorting, setSorting] = useQueryState(
    keys.sort,
    sortParser.withDefault(defaultSorting).withOptions(NUQS_OPTIONS),
  );

  // Normalize: 1-based URL → 0-based TanStack; clamp pageSize to allowed values.
  const pageIndex = Math.max(0, rawPage - 1);
  const pageSize = isValidPageSize(rawPageSize) ? rawPageSize : defaultPageSize;

  const pagination: PaginationState = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: PaginationState) => PaginationState)(pagination)
          : updater;

      const pageChanged = next.pageIndex !== pagination.pageIndex;
      const sizeChanged = next.pageSize !== pagination.pageSize;

      // Page size change always resets to page 1 (standard UX).
      if (sizeChanged) {
        void setRawPageSize(next.pageSize);
        void setRawPage(1);
      } else if (pageChanged) {
        void setRawPage(next.pageIndex + 1);
      }
    },
    [pagination, setRawPage, setRawPageSize],
  );

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: SortingState) => SortingState)(sorting)
          : updater;

      void setSorting(next);
      // Reset to page 1 on sort change — standard UX expectation.
      void setRawPage(1);
    },
    [sorting, setSorting, setRawPage],
  );

  return {
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
  };
};
