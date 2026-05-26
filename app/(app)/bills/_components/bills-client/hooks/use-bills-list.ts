"use client";

import { useMemo, useState } from "react";
import { parseAsString, useQueryStates } from "nuqs";

import { getServiceLabel, dbCodeToServiceKey } from "@/lib/constants/service-colors";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import type { TBillRow, TFilterState, TSortColumn, TSortDir } from "@/features/bills/types";
import { getSortValue } from "../utils/get-sort-value";

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatCreatedAt = (date: Date): string => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getUTCDate()} ${MONTH_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

// "2024-05-01" → "May 2024"
const formatPeriodMonth = (iso: string): string => {
  const [year, monthStr] = iso.split("-");
  const month = Number(monthStr) - 1;
  return `${MONTH_ABBR[month]} ${year}`;
};

// "2024-05-01" → 202405
const toPeriodSort = (iso: string): number => {
  const [year, monthStr] = iso.split("-");
  return Number(year) * 100 + Number(monthStr);
};

const toThresholdSort = (monthsAgo: number): number => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - (monthsAgo - 1));
  return d.getUTCFullYear() * 100 + (d.getUTCMonth() + 1);
};

const toBillRow = (row: TBillGlobalRow): TBillRow => {
  const key = dbCodeToServiceKey(row.serviceTypeCode);
  return {
    id: row.bill.id,
    serviceId: row.bill.serviceId,
    date: formatCreatedAt(row.bill.createdAt),
    sortTs: new Date(row.bill.createdAt).getTime(),
    property: row.property,
    service: {
      id: row.serviceTypeCode,
      name: getServiceLabel(row.serviceTypeCode),
      unit: row.serviceTypeUnit,
    },
    period: formatPeriodMonth(row.bill.periodMonth),
    periodSort: toPeriodSort(row.bill.periodMonth),
    amount: parseFloat(row.bill.amount),
    notes: row.bill.notes,
  };
  void key; // key used indirectly via service.id for color lookup
};

// URL-synced filter state via nuqs.
const URL_FIELDS = {
  property: parseAsString.withDefault("all"),
  service: parseAsString.withDefault("all"),
  period: parseAsString.withDefault("last12"),
} as const;

export const useBillsList = (initialBills: TBillGlobalRow[]) => {
  const [urlFilters, setUrlFilters] = useQueryStates(URL_FIELDS);
  const [sortCol, setSortCol] = useState<TSortColumn>("date");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const filters: TFilterState = urlFilters;

  const handleFilterChange = (next: TFilterState) => {
    void setUrlFilters(next);
    setPage(1);
  };

  const billRows = useMemo((): TBillRow[] => initialBills.map(toBillRow), [initialBills]);

  const filteredBills = useMemo(() => {
    let rows = billRows;

    if (filters.property !== "all") rows = rows.filter((r) => r.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((r) => r.service.id === filters.service);

    if (filters.period === "last6") {
      const threshold = toThresholdSort(6);
      rows = rows.filter((r) => r.periodSort >= threshold);
    } else if (filters.period === "last3") {
      const threshold = toThresholdSort(3);
      rows = rows.filter((r) => r.periodSort >= threshold);
    }

    rows = [...rows].sort((a, b) => {
      const av = getSortValue(a, sortCol);
      const bv = getSortValue(b, sortCol);
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return rows;
  }, [billRows, filters, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredBills.length / perPage);
  const pageRows = filteredBills.slice((page - 1) * perPage, page * perPage);
  const total = filteredBills.reduce((sum, b) => sum + b.amount, 0);
  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.period !== "last12";

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
