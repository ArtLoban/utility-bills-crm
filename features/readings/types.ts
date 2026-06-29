import { TDataTableParams } from "@/components/data-table/types";
import { TDateParams } from "@/lib/types/common";

// --- Sort allow-list ---
// Readings are always ordered by their reading date; it is the only sortable column.
export const READINGS_SORT_COLUMNS = {
  READ_AT: "readAt",
} as const;

export type TReadingSortColumn = (typeof READINGS_SORT_COLUMNS)[keyof typeof READINGS_SORT_COLUMNS];

// --- List query contract ---
// No domain filters beyond the date range: the list is already scoped to one meter.
export type TReadingsListParams = TDataTableParams & TDateParams;

// --- Reading form fields ---
export const ReadingFormField = {
  READ_AT: "readAt",
  VALUE_T1: "valueT1",
  VALUE_T2: "valueT2",
  VALUE_T3: "valueT3",
  NOTES: "notes",
} as const;

export const READING_ZONES = [
  { field: ReadingFormField.VALUE_T1, zone: "T1", suffixKey: "day" },
  { field: ReadingFormField.VALUE_T2, zone: "T2", suffixKey: "night" },
  { field: ReadingFormField.VALUE_T3, zone: "T3", suffixKey: "peak" },
] as const;

export type TReadingZone = (typeof READING_ZONES)[number];
export type TZoneField = TReadingZone["field"];

export type TZoneState = {
  lastValue: number | null;
  warning: boolean;
  delta: number | null;
};
