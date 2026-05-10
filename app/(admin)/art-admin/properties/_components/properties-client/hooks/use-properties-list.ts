"use client";

import { useMemo, useState } from "react";

import {
  ALL_PROPERTIES,
  TFilterState,
  TSortColumn,
  TSortDir,
} from "@/app/(admin)/art-admin/properties/_data/mock";

export const usePropertiesList = () => {
  const [filters, setFilters] = useState<TFilterState>({
    owner: "all",
    status: "all",
    type: "all",
  });
  const [sortCol, setSortCol] = useState<TSortColumn>("created");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    const rows = [...ALL_PROPERTIES];
    rows.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortCol === "name") {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
      } else {
        av = a.createdSort;
        bv = b.createdSort;
      }
      if (av === bv) return 0;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
    return rows;
  }, [sortCol, sortDir]);

  const totalPages = 1;

  const anyFilter = filters.owner !== "all" || filters.status !== "all" || filters.type !== "all";

  const handleFilterChange = (next: TFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleSort = (col: TSortColumn) => {
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
    setPage(1);
  };

  return {
    filters,
    sortCol,
    sortDir,
    page,
    setPage,
    totalPages,
    rows: sortedRows,
    anyFilter,
    handleFilterChange,
    handleSort,
  };
};
