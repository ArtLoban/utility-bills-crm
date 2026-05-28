export type TPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
};

// Backend-driven pagination metadata returned by list-page queries.
export type TServerPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
