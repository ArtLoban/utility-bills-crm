"use client";

import { useMemo, useState } from "react";

import { ALL_BILLS, TFilterState, TSortColumn, TSortDir } from "@/app/(app)/bills/_data/mock";
import { getSortValue } from "../utils/get-sort-value";

export const useBillsList = () => {
  const [filters, setFilters] = useState<TFilterState>({
    property: "all",
    service: "all",
    period: "last12",
  });
  const [sortCol, setSortCol] = useState<TSortColumn>("date");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [addBillOpen, setAddBillOpen] = useState(false);

  const filteredBills = useMemo(() => {
    let rows = [...ALL_BILLS];

    if (filters.property !== "all") rows = rows.filter((r) => r.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((r) => r.service.id === filters.service);
    if (filters.period === "last6") rows = rows.filter((r) => r.periodSort >= 202410);
    if (filters.period === "last3") rows = rows.filter((r) => r.periodSort >= 202501);

    rows.sort((a, b) => {
      const av = getSortValue(a, sortCol);
      const bv = getSortValue(b, sortCol);
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return rows;
  }, [filters, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredBills.length / perPage);
  const pageRows = filteredBills.slice((page - 1) * perPage, page * perPage);
  const total = filteredBills.reduce((sum, b) => sum + b.amount, 0);
  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.period !== "last12";

  const handleFilterChange = (next: TFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleSort = (col: TSortColumn) => {
    setPage(1);
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };

  const handlePerPageChange = (next: number) => {
    setPerPage(next);
    setPage(1);
  };

  return {
    filters,
    sortCol,
    sortDir,
    page,
    setPage,
    perPage,
    addBillOpen,
    setAddBillOpen,
    filteredBills,
    totalPages,
    pageRows,
    total,
    anyFilter,
    handleFilterChange,
    handleSort,
    handlePerPageChange,
  };
};
