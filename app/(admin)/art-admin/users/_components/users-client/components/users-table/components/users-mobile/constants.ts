import { ADMIN_USER_SORT_COLUMNS, type TAdminUsersSortColumn } from "@/features/admin-users/types";

export type TSortField = {
  readonly id: TAdminUsersSortColumn;
  readonly label: string;
  readonly defaultDesc: boolean;
  readonly ascLabel: string;
  readonly descLabel: string;
  readonly triggerAsc: string;
  readonly triggerDesc: string;
};

export const SORT_FIELDS = [
  {
    id: ADMIN_USER_SORT_COLUMNS.CREATED_AT,
    label: "Created",
    defaultDesc: true,
    ascLabel: "Oldest",
    descLabel: "Newest",
    triggerAsc: "Oldest first",
    triggerDesc: "Newest first",
  },
  {
    id: ADMIN_USER_SORT_COLUMNS.EMAIL,
    label: "Email",
    defaultDesc: false,
    ascLabel: "A → Z",
    descLabel: "Z → A",
    triggerAsc: "Email A–Z",
    triggerDesc: "Email Z–A",
  },
  {
    id: ADMIN_USER_SORT_COLUMNS.NAME,
    label: "Name",
    defaultDesc: false,
    ascLabel: "A → Z",
    descLabel: "Z → A",
    triggerAsc: "Name A–Z",
    triggerDesc: "Name Z–A",
  },
  {
    id: ADMIN_USER_SORT_COLUMNS.LAST_LOGIN_AT,
    label: "Last login",
    defaultDesc: true,
    ascLabel: "Oldest",
    descLabel: "Recent",
    triggerAsc: "Oldest first",
    triggerDesc: "Recent first",
  },
] as const satisfies readonly TSortField[];

export type TMobileSortColumn = (typeof SORT_FIELDS)[number]["id"];

export const DEFAULT_SORT_ID: TMobileSortColumn = ADMIN_USER_SORT_COLUMNS.CREATED_AT;
export const DEFAULT_SORT_DESC = true;
