import type { SortingState } from "@tanstack/react-table";
import {
  DEFAULT_SORT_DESC,
  DEFAULT_SORT_ID,
  SORT_FIELDS,
  type TMobileSortColumn,
} from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/constants";

export type TResolvedSort = {
  id: TMobileSortColumn;
  desc: boolean;
};

// Normalize raw TanStack sorting state (id is a plain string) to a known sort
// field. An id outside the mobile sort allow-list collapses to the default.
export const resolveSort = (sorting: SortingState): TResolvedSort => {
  const current = sorting[0];
  const field = current ? SORT_FIELDS.find((f) => f.id === current.id) : undefined;

  if (!field || !current)
    return {
      id: DEFAULT_SORT_ID,
      desc: DEFAULT_SORT_DESC,
    };

  return {
    id: field.id,
    desc: current.desc,
  };
};
