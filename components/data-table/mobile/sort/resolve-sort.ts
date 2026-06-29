import type { SortingState } from "@tanstack/react-table";

import type { TMobileSortField, TResolvedSort } from "../types";

export const resolveSort = (
  sorting: SortingState,
  sortFields: readonly TMobileSortField[],
  defaultSort: TResolvedSort,
): TResolvedSort => {
  const current = sorting[0];
  const field = current ? sortFields.find(({ id }) => id === current.id) : undefined;

  if (!field || !current) return defaultSort;

  return { id: field.id, desc: current.desc };
};
