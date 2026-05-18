import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // TData/TValue intentionally unused — required by TanStack's ColumnMeta signature.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "right" | "center";
    width?: number;
    headerClassName?: string;
    cellClassName?: string;
  }
}

export type TUrlKeys = {
  page?: string;
  pageSize?: string;
  sort?: string;
};

export type TResolvedUrlKeys = Required<TUrlKeys>;
