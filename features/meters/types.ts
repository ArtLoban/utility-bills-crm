import { TDataTableParams } from "@/components/data-table/types";

// --- Sort allow-list ---

export const METERS_SORT_COLUMNS = {
  PROPERTY: "property",
  SERVICE: "service",
  INSTALLED: "installed",
} as const;

export type TMeterSortColumn = (typeof METERS_SORT_COLUMNS)[keyof typeof METERS_SORT_COLUMNS];

// --- Status filter: derived from the system temporal range (validTo IS NULL = active) ---

export const METER_STATUSES = {
  ACTIVE: "active",
  HISTORICAL: "historical",
  ALL: "all",
} as const;

export type TMeterStatus = (typeof METER_STATUSES)[keyof typeof METER_STATUSES];

// --- List query contract ---

export const METERS_FILTERS = {
  PROPERTY_ID: "propertyId",
  SERVICES: "services",
  STATUS: "status",
} as const;

export type TMetersListParams = TDataTableParams & {
  [METERS_FILTERS.PROPERTY_ID]?: string | null;
  [METERS_FILTERS.SERVICES]?: string[] | null; // serviceType codes, ;-separated in URL
  [METERS_FILTERS.STATUS]: TMeterStatus;
};
