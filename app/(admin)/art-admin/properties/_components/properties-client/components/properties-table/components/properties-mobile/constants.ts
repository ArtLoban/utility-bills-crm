import {
  ADMIN_PROPERTY_SORT_COLUMNS,
  type TAdminPropertiesSortColumn,
} from "@/features/admin-properties/types";

export type TSortField = {
  readonly id: TAdminPropertiesSortColumn;
  readonly label: string;
  readonly defaultDesc: boolean;
  readonly ascLabel: string;
  readonly descLabel: string;
  readonly triggerAsc: string;
  readonly triggerDesc: string;
};

export const SORT_FIELDS = [
  {
    id: ADMIN_PROPERTY_SORT_COLUMNS.CREATED_AT,
    label: "Created",
    defaultDesc: true,
    ascLabel: "Oldest",
    descLabel: "Newest",
    triggerAsc: "Oldest first",
    triggerDesc: "Newest first",
  },
  {
    id: ADMIN_PROPERTY_SORT_COLUMNS.NAME,
    label: "Name",
    defaultDesc: false,
    ascLabel: "A → Z",
    descLabel: "Z → A",
    triggerAsc: "Name A–Z",
    triggerDesc: "Name Z–A",
  },
  {
    id: ADMIN_PROPERTY_SORT_COLUMNS.TYPE,
    label: "Type",
    defaultDesc: false,
    ascLabel: "A → Z",
    descLabel: "Z → A",
    triggerAsc: "Type A–Z",
    triggerDesc: "Type Z–A",
  },
  {
    id: ADMIN_PROPERTY_SORT_COLUMNS.STATUS,
    label: "Status",
    defaultDesc: false,
    ascLabel: "Active first",
    descLabel: "Deleted first",
    triggerAsc: "Active first",
    triggerDesc: "Deleted first",
  },
] as const satisfies readonly TSortField[];

export type TMobileSortColumn = (typeof SORT_FIELDS)[number]["id"];

export const DEFAULT_SORT_ID: TMobileSortColumn = ADMIN_PROPERTY_SORT_COLUMNS.CREATED_AT;
export const DEFAULT_SORT_DESC = true;
