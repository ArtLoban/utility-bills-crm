"use client";

import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TSortColumn, TSortDir } from "@/app/(app)/payments/_data/mock";

const SORT_COLUMNS = [
  "date",
  "property",
  "service",
  "amount",
] as const satisfies readonly TSortColumn[];
const SORT_DIRS = ["asc", "desc"] as const satisfies readonly TSortDir[];

export const usePaymentsFilters = () => {
  const [state, setState] = useQueryStates(
    {
      property: parseAsString,
      service: parseAsString,
      period: parseAsString,
      sortCol: parseAsStringEnum([...SORT_COLUMNS]).withDefault("date"),
      sortDir: parseAsStringEnum([...SORT_DIRS]).withDefault("desc"),
    },
    {
      history: "replace",
      shallow: true,
      clearOnDefault: true,
    },
  );

  const toggleSort = (col: TSortColumn) => {
    if (state.sortCol === col) {
      setState({ sortDir: state.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setState({ sortCol: col, sortDir: "asc" });
    }
  };

  const clearFilters = () => {
    setState({ property: null, service: null, period: null });
  };

  const hasActiveFilters = Boolean(state.property || state.service || state.period);

  return { state, setState, toggleSort, clearFilters, hasActiveFilters };
};
