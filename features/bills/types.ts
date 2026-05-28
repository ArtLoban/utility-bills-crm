import type { TServerPagination } from "@/lib/types/data-table";

// --- Sort allow-list ---

export const BILLS_SORT_COLUMNS = ["periodMonth", "amount", "createdAt"] as const;
export type TBillSortColumn = (typeof BILLS_SORT_COLUMNS)[number];

// --- List query contract ---

export type TBillsListParams = {
  page: number;
  pageSize: number;
  sortBy: TBillSortColumn;
  sortOrder: "asc" | "desc";
  propertyId?: string;
  services?: string[];
  dateFrom?: string; // YYYY-MM-DD, inclusive
  dateTo?: string; // YYYY-MM-DD, inclusive
};

// Re-export shared pagination type under the bills-scoped name.
export type { TServerPagination as TBillsPagination };
