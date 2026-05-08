"use client";

import { useMemo, useState } from "react";

import {
  ALL_PAYMENTS,
  TFilterState,
  TPayment,
  TSortColumn,
  TSortDir,
} from "@/app/(app)/payments/_data/mock";
import { getSortValue } from "../utils/get-sort-value";

export const usePaymentsList = () => {
  const [filters, setFilters] = useState<TFilterState>({
    property: "all",
    service: "all",
    period: "last12",
  });
  const [sortCol, setSortCol] = useState<TSortColumn>("date");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<TPayment | undefined>(undefined);

  const filteredPayments = useMemo(() => {
    let rows = [...ALL_PAYMENTS];

    if (filters.property !== "all") rows = rows.filter((r) => r.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((r) => r.service.id === filters.service);
    if (filters.period === "last6") rows = rows.filter((r) => r.sortTs >= 20241001);
    if (filters.period === "last3") rows = rows.filter((r) => r.sortTs >= 20250101);

    rows.sort((a, b) => {
      const av = getSortValue(a, sortCol);
      const bv = getSortValue(b, sortCol);
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return rows;
  }, [filters, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredPayments.length / perPage);
  const pageRows = filteredPayments.slice((page - 1) * perPage, page * perPage);
  const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
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

  const openCreate = () => {
    setEditingPayment(undefined);
    setModalOpen(true);
  };

  const openEdit = (payment: TPayment) => {
    setEditingPayment(payment);
    setModalOpen(true);
  };

  return {
    filters,
    sortCol,
    sortDir,
    page,
    setPage,
    perPage,
    filteredPayments,
    totalPages,
    pageRows,
    total,
    anyFilter,
    modalOpen,
    setModalOpen,
    editingPayment,
    handleFilterChange,
    handleSort,
    handlePerPageChange,
    openCreate,
    openEdit,
  };
};
