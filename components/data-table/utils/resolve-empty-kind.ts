import { EMPTY_STATE_KINDS, TEmptyStateKind } from "@/components/data-table/types";

export const resolveEmptyKind = (hasActiveFilters: boolean): TEmptyStateKind =>
  hasActiveFilters ? EMPTY_STATE_KINDS.NO_RESULTS : EMPTY_STATE_KINDS.EMPTY;
