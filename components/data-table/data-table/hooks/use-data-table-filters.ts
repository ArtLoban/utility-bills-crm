import { useMemo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";

export const useDataTableFilters = <T>(query: Partial<Record<keyof T, unknown>>) => {
  return useMemo<ColumnFiltersState>(() => {
    return Object.entries(query).reduce<ColumnFiltersState>((acc, [id, value]) => {
      if (value === null || value === undefined || value === "") {
        return acc;
      }

      acc.push({ id, value });

      return acc;
    }, []);
  }, [query]);
};
