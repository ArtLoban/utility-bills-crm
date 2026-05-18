export type TPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
};
