import { TDataTableParams } from "@/components/data-table/types";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";

// --- Replace-meter form field names (single source for RHF names + defaults) ---

export const ReplaceMeterFormField = {
  REPLACEMENT_DATE: "replacementDate",
  SERIAL_NUMBER: "serialNumber",
  ZONE_COUNT: "zoneCount",
  INSTALLED_AT: "installedAt",
  NOTES: "notes",
} as const;

// --- Add-meter form field names ---

export const CreateMeterFormField = {
  SERVICE_TYPE_ID: "serviceTypeId",
  SERVICE_IDS: "serviceIds",
  SERIAL_NUMBER: "serialNumber",
  ZONE_COUNT: "zoneCount",
  INSTALLED_AT: "installedAt",
  VALID_FROM: "validFrom",
  NOTES: "notes",
} as const;

// A metered service line a meter may feed (Slice B2). The Add Meter form filters these by the
// chosen service type; a meter's linked services must share its type.
export type TEligibleMeterService = {
  id: TServiceId;
  serviceTypeId: TServiceTypeId;
  code: string;
  name: string | null;
};

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
