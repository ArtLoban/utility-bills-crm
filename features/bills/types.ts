// --- Sort allow-list ---

export const BILLS_SORT_COLUMNS = ["periodMonth", "amount", "createdAt"] as const;
export type TBillSortColumn = (typeof BILLS_SORT_COLUMNS)[number];

// --- List query contract ---

export type TBillsListParams = {
  page: number;
  pageSize: number;
  sortBy: TBillSortColumn;
  sortOrder: "asc" | "desc";
  propertyId?: string | null;
  services?: string[] | null;
  dateFrom?: string | null; // YYYY-MM-DD, inclusive
  dateTo?: string | null; // YYYY-MM-DD, inclusive
};
